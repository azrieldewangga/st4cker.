# CampusDash Enhancement Implementation Plan

## Overview
Comprehensive plan to enhance CampusDash with missing features, improved UX, and technical improvements based on audit findings.

---

## 🔴 Phase 1: Critical Features (High Priority)

### 1. Single Instance Lock & Startup Cleanup

**Goal:** Prevent multiple app instances from running simultaneously, especially on startup.

> [!WARNING]
> **Current Issue:** App runs at startup but opens 2 instances (production + dev)

**Implementation:**

#### Single Instance Lock
- Use Electron's `app.requestSingleInstanceLock()`
- If second instance detected, focus existing window and quit
- Handle deep links properly (pass to existing instance)

#### Startup Registry Cleanup
- Only set production build path in startup registry
- Remove dev/old entries on app update
- Verify startup path points to correct executable

#### Detection Logic
```typescript
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Focus existing window if user tries to open again
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
```

**Files to Modify:**
- [MODIFY] `electron/main.cts` - Add single instance lock at app initialization
- [MODIFY] `electron/main.cts` - Verify startup path in `setLoginItemSettings`

---

### 2. Desktop Notifications for Deadlines

**Goal:** Add native Electron notifications to alert users of upcoming assignment deadlines.

**Implementation:**

#### Backend (Electron Main Process)
- Add notification scheduler service in `electron/services/notification-scheduler.ts`
- Use `node-cron` or custom interval to check deadlines daily
- Trigger `new Notification()` via IPC to main process

#### Database
- Query assignments with deadlines within next 1, 3, 7 days
- Filter out already-notified assignments using notification log table

#### Frontend
- Add notification preferences in Settings page:
  - Enable/disable notifications
  - Notification timing (H-1, H-3, H-7)
  - Quiet hours (e.g., 10 PM - 7 AM)
- Show notification permission request on first launch

**Files to Modify:**
- [NEW] `electron/services/notification-scheduler.ts`
- [MODIFY] `electron/main.cts` - Register scheduler
- [MODIFY] `src/pages/Settings.tsx` - Add notification preferences
- [MODIFY] `electron/db/assignments.cts` - Add notification queries

---

### 2. Data Validation & Error Handling

**Goal:** Prevent invalid data entry and improve error messaging throughout the app.

**Implementation:**

#### Input Validation
- Add Zod schemas for all data models
- Validate on frontend before IPC call
- Validate on backend before database write

**Key Validations:**
- Transaction amounts: Must be positive numbers, max 2 decimal places
- Dates: Must be valid, cannot be in distant past/future
- Semester: 1-8 only
- Course credits (SKS): 1-6 only
- GPA: 0.00-4.00 range

#### Error Boundaries
- Add React Error Boundary component
- Wrap each page/route with error boundary
- Show user-friendly error UI with "Report Bug" button

**Files to Create/Modify:**
- [NEW] `src/lib/validation.ts` - Zod schemas
- [NEW] `src/components/shared/ErrorBoundary.tsx`
- [MODIFY] All form submissions - Add validation
- [MODIFY] `electron/db/*.cts` - Add backend validation

---

### 3. Loading States & Empty States

**Goal:** Improve UX with proper loading indicators and empty state messaging.

**Implementation:**

#### Skeleton Loaders
- Create reusable skeleton components for:
  - Table rows (Assignments, Performance)
  - Cards (Dashboard, Cashflow)
  - Charts (loading shimmer)

#### Empty States
- Design illustrated empty states for:
  - No assignments
  - No transactions
  - No courses
  - No materials
- Include call-to-action buttons

**Files to Create/Modify:**
- [NEW] `src/components/shared/SkeletonTable.tsx`
- [NEW] `src/components/shared/SkeletonCard.tsx`
- [NEW] `src/components/shared/EmptyState.tsx`
- [MODIFY] All data-fetching components - Show skeletons on load

---

## 🟡 Phase 2: Major Features (Medium Priority)

### 4. Global Search

**Goal:** Implement working search functionality across all app modules.

**Implementation:**

#### Search Index
- Create unified search function that queries:
  - Assignments (title, note, course name)
  - Transactions (title, category)
  - Courses (name, code)
  - Schedule materials (title, url)

#### UI
- Connect header search bar to search dialog
- Show categorized results (Assignments | Transactions | Courses)
- Navigate to item on click
- Keyboard shortcut: `Ctrl+F` or `Ctrl+Shift+F`

**Files to Modify:**
- [MODIFY] `src/components/layout/Search.tsx` - Implement functionality
- [NEW] `src/components/shared/GlobalSearchDialog.tsx`
- [MODIFY] `src/store/useStore.ts` - Add global search action
- [MODIFY] `electron/db/search.cts` - Add search queries

---

### 5. Bulk Actions for Assignments

**Goal:** Allow users to select multiple assignments for bulk operations.

**Implementation:**

#### Selection State
- Add checkbox column to assignments table
- Track selected assignment IDs in state
- Show bulk action toolbar when items selected

#### Bulk Operations
- Mark as Done
- Mark as In Progress
- Delete (with confirmation)
- Duplicate

**Files to Modify:**
- [MODIFY] `src/pages/Assignments.tsx` - Add selection logic
- [MODIFY] Assignment table - Add checkbox column
- [NEW] Bulk action toolbar component

---

### 6. Export Data (CSV/Excel)

**Goal:** Allow users to export transactions and grades to CSV/Excel format.

**Implementation:**

#### Export Functionality
- Use `papaparse` for CSV generation
- Export transactions with filters applied
- Export performance data per semester
- Add "Export" button to Cashflow and Performance pages

#### Export Options
- Date range selection
- Include/exclude categories
- Currency format (IDR/USD)

**Files to Create/Modify:**
- [NEW] `src/lib/export.ts` - Export utilities
- [MODIFY] `src/pages/Cashflow.tsx` - Add export button
- [MODIFY] `src/pages/Performance.tsx` - Add export button
- Install: `npm install papaparse @types/papaparse`

---

### 7. Recurring Transactions from Subscriptions

**Goal:** Automatically create expense transactions when subscription is due.

**Implementation:**

#### Auto-Transaction Logic
- Check subscriptions daily (via scheduler)
- Create transaction on billing date
- Mark subscription as paid for current cycle
- Notify user of auto-added transaction

#### Settings
- Add "Auto-add subscription expenses" toggle in Settings
- Configure auto-add timing (on due date / 1 day before)

**Files to Modify:**
- [NEW] `electron/services/subscription-processor.ts`
- [MODIFY] `electron/main.cts` - Register scheduler
- [MODIFY] `src/pages/Settings.tsx` - Add preference toggle
- [MODIFY] Subscription notifications - Update paid logic

---

### 8. Drag & Drop for Schedule Files

**Goal:** Add drag-and-drop file upload for schedule materials.

**Implementation:**

#### Drag & Drop Zone
- Add drop zone to material section in Schedule page
- Visual feedback on drag-over
- Support multiple files at once
- Show upload progress

#### File Handling
- Same validation as file picker
- Batch upload with progress indicator

**Files to Modify:**
- [MODIFY] `src/pages/Schedule.tsx` - Add drop zone
- Use library: `react-dropzone` or native HTML5 drag-drop API

---

## 🟢 Phase 3: Polish & Quality (Nice to Have)

### 9. Auto Theme Switching by Time

**Goal:** Allow users to schedule automatic theme changes based on time of day.

**Implementation:**

#### Settings
- Add "Auto-switch theme" toggle
- Time range selectors (e.g., Light: 6 AM - 6 PM)
- Check time on app start and hourly

#### Logic
- Store auto-switch settings in localStorage
- Override manual theme selection when auto mode enabled
- Show indicator in UI when auto mode is active

**Files to Modify:**
- [MODIFY] `src/pages/Settings.tsx` - Add auto-switch settings
- [MODIFY] `src/components/theme-provider.tsx` - Add auto-switch logic

---

### 10. Improved Undo Toast Duration

**Goal:** Extend undo toast duration to give users more time to react.

**Implementation:**

#### Current Issues
- Toast may disappear too quickly
- Users miss undo opportunity

#### Solution
- Increase toast duration to 5-7 seconds (from default ~3s)
- Add visual countdown indicator
- Toast remains visible on hover

**Files to Modify:**
- [MODIFY] All toast implementations - Update duration
- Check: `src/pages/Assignments.tsx`, `Cashflow.tsx`, etc.
- Configure Sonner toast default duration globally

---

## 🔧 Phase 4: Technical Improvements

### 11. Unit & E2E Testing

**Goal:** Add test coverage for critical functionality.

**Priority Tests:**
- CRUD operations (assignments, transactions, courses)
- GPA calculations
- Data validation
- Undo/Redo functionality
- Google Drive backup/restore

**Setup:**
- Frontend: Vitest + React Testing Library
- E2E: Playwright for Electron
- Target: 60%+ coverage for core features

**Files to Create:**
- [NEW] `vitest.config.ts`
- [NEW] `tests/` directory structure
- [NEW] Example tests for each module

---

### 12. React Error Boundaries

**Goal:** Prevent entire app crashes from component errors.

**Implementation:**
- Create `ErrorBoundary` component
- Wrap each route in error boundary
- Log errors to file for debugging
- Show user-friendly error UI with recovery options

**Files to Create:**
- [NEW] `src/components/shared/ErrorBoundary.tsx`
- [MODIFY] `src/App.tsx` - Wrap routes
- [NEW] Error logging service

---

### 13. TypeScript Strict Mode & Cleanup

**Goal:** Improve type safety and remove technical debt.

**Tasks:**
- Enable `strict: true` in `tsconfig.json`
- Fix all type errors
- Remove `@ts-ignore` comments (replace with proper types)
- Add types for all `any` usages
- Document complex types with JSDoc

**Files to Modify:**
- [MODIFY] `tsconfig.json` - Enable strict mode
- [MODIFY] Many files - Fix type errors
- Focus areas: Electron API types, store types, component props

---

## Implementation Priority Order

**Sprint 1 (Week 1-2):**
1. Data Validation & Error Handling
2. Loading States & Empty States
3. Desktop Notifications

**Sprint 2 (Week 3-4):**
4. Global Search
5. Export Data
6. Bulk Actions

**Sprint 3 (Week 5-6):**
7. Recurring Transactions
8. Drag & Drop Files
9. Undo Toast Duration

**Sprint 4 (Week 7+):**
10. Auto Theme Switching
11. Error Boundaries
12. TypeScript Strict Mode
13. Testing Setup

---

## Verification Plan

Each feature will be verified through:
- ✅ Manual testing in development
- ✅ Build verification (`npm run build`)
- ✅ Production testing in packaged app
- ✅ User acceptance testing (if applicable)
