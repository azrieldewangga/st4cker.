export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export type AssignmentStatus = 'to-do' | 'progress' | 'done';
export type AssignmentType = 'Laporan Pendahuluan' | 'Laporan Sementara' | 'Laporan Resmi' | 'Tugas';

export interface Assignment extends BaseEntity {
    courseId: string;
    title: string;
    type: AssignmentType;
    deadline: string; // ISO date string
    status: AssignmentStatus;
    note?: string;
    customOrder?: number;
    semester?: number;
}

export interface UserProfile extends BaseEntity {
    name: string;
    semester: number;
    avatar?: string;
    cardLast4?: string;
    major?: string;
}


export interface Course extends BaseEntity {
    name: string;
    semester: number;
    sks?: number;
    grade?: string;
    location?: string;
    lecturer?: string;
}

export interface Transaction extends BaseEntity {
    title: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string; // ISO date string
    currency?: 'IDR' | 'USD';
}

export interface CourseMaterial extends BaseEntity {
    courseId: string;
    type: 'link' | 'file';
    title: string;
    url: string;
}

export interface Subscription extends BaseEntity {
    name: string;
    cost: number;
    dueDay: number;
    lastPaidDate?: string;
}

export type ProjectStatus = 'active' | 'completed' | 'on-hold';
export type ProjectPriority = 'low' | 'medium' | 'high';

export interface Project extends BaseEntity {
    title: string;
    courseId: string | null; // null = Personal Project
    description?: string;
    startDate: string; // ISO date string
    deadline: string; // ISO date string
    totalProgress: number; // 0-100
    status: ProjectStatus;
    priority: ProjectPriority;
    semester?: number;
    lastSessionDate?: string; // ISO date string
}

export interface ProjectSession {
    id: string;
    projectId: string;
    sessionDate: string; // ISO date string
    duration: number; // in minutes
    note?: string;
    progressBefore: number; // 0-100
    progressAfter: number; // 0-100
    createdAt: string;
}

export interface ProjectAttachment {
    id: string;
    projectId: string;
    type: 'file' | 'link';
    name: string;
    path: string; // file path or URL
    size?: number; // file size in bytes (null for links)
    createdAt: string;
}
