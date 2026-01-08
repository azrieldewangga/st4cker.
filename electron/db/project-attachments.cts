import { getDB } from './index.cjs';
import { randomUUID } from 'crypto';

export const projectAttachments = {
    // Get all attachments for a project
    getByProjectId: (projectId: string) => {
        const db = getDB();
        return db.prepare('SELECT * FROM project_attachments WHERE projectId = ? ORDER BY createdAt DESC').all(projectId);
    },

    // Get attachment by ID
    getById: (id: string) => {
        const db = getDB();
        return db.prepare('SELECT * FROM project_attachments WHERE id = ?').get(id);
    },

    // Create new attachment
    create: (data: any) => {
        const db = getDB();
        const stmt = db.prepare(`
            INSERT INTO project_attachments 
            (id, projectId, type, name, path, size, createdAt)
            VALUES (@id, @projectId, @type, @name, @path, @size, @createdAt)
        `);
        stmt.run({
            id: data.id || randomUUID(),
            projectId: data.projectId,
            type: data.type, // 'file' | 'link'
            name: data.name,
            path: data.path,
            size: data.size || null,
            createdAt: data.createdAt || new Date().toISOString()
        });
        return { success: true };
    },

    // Delete attachment
    delete: (id: string) => {
        const db = getDB();
        const stmt = db.prepare('DELETE FROM project_attachments WHERE id = ?');
        stmt.run(id);
        return { success: true };
    }
};
