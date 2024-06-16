import sqlite, { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbFileName = '../Database/Users.db';

class DB {
    private static initialTableCreationDone: boolean = false;

    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `./${dbFileName}`,
            driver: sqlite3.Database
        });
        await db.get('PRAGMA foreign_keys = ON');
        await DB.ensureTablesCreated(db);
        return db;
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {
        if (this.initialTableCreationDone) {
            return;
        }
        await connection.exec(`
            CREATE TABLE IF NOT EXISTS Settings (
                id TEXT PRIMARY KEY,
                acceleration INTEGER,
                maxSpeed INTEGER,
                steering INTEGER
            );
        `);
        this.initialTableCreationDone = true;
    }
}

export async function saveSettings(id: string, acceleration: number, maxSpeed: number, steering: number) {
    const db = await DB.createDBConnection();
    try {
        const selectStmt = await db.prepare('SELECT id FROM Settings WHERE id = ?');
        await selectStmt.bind(id);
        const existingRow = await selectStmt.get();
        await selectStmt.finalize();

        if (existingRow) {
            const updateStmt = await db.prepare(
                'UPDATE Settings SET acceleration = ?, maxSpeed = ?, steering = ? WHERE id = ?'
            );
            await updateStmt.bind(acceleration, maxSpeed, steering, id);
            await updateStmt.run();
            await updateStmt.finalize();
        } else {
            const insertStmt = await db.prepare(
                'INSERT INTO Settings (id, acceleration, maxSpeed, steering) VALUES (?, ?, ?, ?)'
            );
            await insertStmt.bind(id, acceleration, maxSpeed, steering);
            await insertStmt.run();
            await insertStmt.finalize();
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    } finally {
        await db.close();
    }
}

export async function fetchCurrentSettings(id: string): Promise<{ acceleration: number, maxSpeed: number, steering: number } | null> {
    const db = await DB.createDBConnection();
    try {
        const selectStmt = await db.prepare(
            'SELECT acceleration, maxSpeed, steering FROM Settings WHERE id = ?'
        );
        await selectStmt.bind(id);
        let settings = await selectStmt.get();
        await selectStmt.finalize();

        if (!settings) {
            const insertStmt = await db.prepare(
                'INSERT INTO Settings (id, acceleration, maxSpeed, steering) VALUES (?, ?, ?, ?)'
            );
            await insertStmt.bind(id, 0, 0, 0);
            await insertStmt.run();
            await insertStmt.finalize();
            settings = {
                acceleration: 0,
                maxSpeed: 0,
                steering: 0
            };
        }

        return settings;
    } catch (error) {
        console.error('Error fetching settings:', error);
        throw error;
    } finally {
        await db.close();
    }
}