import { getDB } from './index.cjs';
import { randomUUID } from 'crypto';

export const projects = {
    // Get all projects
    getAll: () => {
        const db = getDB();
        return db.prepare('SELECT * FROM projects ORDER BY deadline ASC').all();
    },

    // Get project by ID
    getById: (id: string) => {
        const db = getDB();
        return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    },

    // Create new project
    create: (data: any) => {
        const db = getDB();
        const stmt = db.prepare(`
            INSERT INTO projects 
            (id, title, courseId, description, startDate, deadline, totalProgress, status, priority, semester, createdAt, updatedAt, lastSessionDate)
            VALUES (@id, @title, @courseId, @description, @startDate, @deadline, @totalProgress, @status, @priority, @semester, @createdAt, @updatedAt, @lastSessionDate)
        `);
        stmt.run({
            id: data.id || randomUUID(),
            title: data.title,
            courseId: data.courseId || null,
            description: data.description || '',
            startDate: data.startDate,
            deadline: data.deadline,
            totalProgress: data.totalProgress || 0,
            status: data.status || 'active',
            priority: data.priority || 'medium',
            semester: data.semester,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            lastSessionDate: data.lastSessionDate || null
        });
        return { success: true };
    },

    // Update project
    update: (id: string, data: any) => {
        const db = getDB();
        const fields = Object.keys(data);
        const sets = fields.map(f => `${f} = @${f}`).join(', ');
        const stmt = db.prepare(`UPDATE projects SET ${sets}, updatedAt = @updatedAt WHERE id = @id`);
        stmt.run({ ...data, updatedAt: new Date().toISOString(), id });
        return { success: true };
    },

    // Update progress and lastSessionDate
    updateProgress: (id: string, progress: number) => {
        const db = getDB();
        const stmt = db.prepare('UPDATE projects SET totalProgress = ?, lastSessionDate = ?, updatedAt = ? WHERE id = ?');
        stmt.run(progress, new Date().toISOString(), new Date().toISOString(), id);
        return { success: true };
    },

    // Delete project (cascade will delete sessions and attachments)
    delete: (id: string) => {
        const db = getDB();
        const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
        stmt.run(id);
        return { success: true };
    }
};
