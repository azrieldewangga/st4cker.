/**
 * Application-wide constants
 * Centralized location for magic numbers and configuration values
 */

// =========================================
// Currency & Exchange Rates
// =========================================
export const EXCHANGE_RATES = {
  /**
   * Default fallback rate for IDR to USD conversion
   * Used when API is unavailable or fails
   */
  FALLBACK_IDR_TO_USD: 16000,
  
  /**
   * Cache duration for exchange rate (in milliseconds)
   * 168 hours = 7 days
   */
  CACHE_DURATION: 168 * 60 * 60 * 1000,
} as const;

// =========================================
// Analytics Configuration
// =========================================
export const ANALYTICS_CONFIG = {
  /**
   * Number of weeks in a semester for heatmap display
   */
  SEMESTER_WEEKS: 26,
  
  /**
   * Default monthly spending limit (in IDR)
   */
  DEFAULT_MONTHLY_LIMIT: 5_000_000, // 5 juta IDR
  
  /**
   * Number of activity levels for heatmap coloring
   */
  HEATMAP_LEVELS: 5,
  
  /**
   * Heatmap color scale classes
   */
  HEATMAP_COLOR_SCALE: {
    LEVEL_0: 'bg-muted/50',
    LEVEL_1: 'bg-emerald-500/30',
    LEVEL_2: 'bg-emerald-500/50',
    LEVEL_3: 'bg-emerald-500/70',
    LEVEL_4: 'bg-emerald-500'
  }
} as const;

// =========================================
// Chart Colors
// =========================================
export const CHART_COLORS = {
  primary: 'var(--chart-1)',
  income: '#10b981',    // Emerald 500
  expense: '#f43f5e',   // Rose 500
  balance: '#10b981'
} as const;

// =========================================
// Grade Values
// =========================================
/**
 * Mapping of grade letters to GPA values
 */
export const GRADE_VALUES: Record<string, number> = {
  'A': 4.00,
  'A-': 3.75,
  'AB': 3.50,
  'B+': 3.25,
  'B': 3.00,
  'BC': 2.50,
  'C': 2.00,
  'D': 1.00,
  'E': 0.00
} as const;

// =========================================
// Transaction Categories
// =========================================
/**
 * Available categories for transactions
 */
export const TRANSACTION_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Subscription',
  'Transfer',
  'Salary'
] as const;

export type TransactionCategory = typeof TRANSACTION_CATEGORIES[number];

// =========================================
// LocalStorage Keys
// =========================================
export const STORAGE_KEYS = {
  EXCHANGE_RATE: 'exchangeRate_IDR_USD',
  NOTIFICATIONS_LAST_CHECKED: 'st4cker-notifications-last-checked',
  THEME: 'theme'
} as const;

// =========================================
// Development Mode Detection
// =========================================
/**
 * Check if running in development mode
 */
export const isDev = import.meta.env.DEV;
