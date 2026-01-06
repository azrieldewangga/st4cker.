import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { initSchema } from './schema.cjs';
// @ts-ignore
import log from 'electron-log/main.js';

let db: Database.Database | null = null;

export const getDB = () => {
    if (!db) {
        const userDataPath = app.getPath('userData');
        let dbPath: string;

        if (process.env.VITE_DEV_SERVER_URL) {
            // Dev mode: store DB in project root
            dbPath = path.join(process.cwd(), 'st4cker.db');
            console.log('[DB] Dev Mode: Using CWD database:', dbPath);
        } else {
            // Production mode: store DB in userData with migration logic
            dbPath = path.join(userDataPath, 'st4cker.db');

            // Migration: Rename old database if exists
            const oldDbPath = path.join(userDataPath, 'campusdash.db');
            if (fs.existsSync(oldDbPath) && !fs.existsSync(dbPath)) {
                log.info('[DB] Migrating database: campusdash.db → st4cker.db');
                try {
                    fs.renameSync(oldDbPath, dbPath);
                    log.info('[DB] Migration complete');
                } catch (error) {
                    log.error('[DB] Migration failed:', error);
                    // Fallback to old path if migration fails
                    dbPath = oldDbPath;
                }
            }
        }

        // Debug Log
        try {
            fs.appendFileSync('debug_info.txt', `[DB] Connecting to: ${dbPath}\n`);
        } catch { }

        console.log('[DB] Connecting to:', dbPath);
        db = new Database(dbPath);
        db.pragma('journal_mode = DELETE');

        // Initialize Schema
        initSchema(db);
    }
    return db;
};

// Helper for closing if needed
export const closeDB = () => {
    if (db) {
        db.close();
        db = null;
    }
};
