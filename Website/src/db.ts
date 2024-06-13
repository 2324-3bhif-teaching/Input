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
    const existingRow = await db.get('SELECT id FROM Settings WHERE id = ?', id);

    if (existingRow) {
        await db.run(`UPDATE Settings SET acceleration = ?, maxSpeed = ?, steering = ? WHERE id = ?`,
            acceleration, maxSpeed, steering, id);
        
    } else {
        await db.run(`INSERT INTO Settings (id, acceleration, maxSpeed, steering) VALUES (?, ?, ?, ?)`,
            id, acceleration, maxSpeed, steering);
    }

    await db.close();
}

export async function fetchCurrentSettings(id: string): Promise<{ acceleration: number, maxSpeed: number, steering: number } | null> {
    const db = await DB.createDBConnection();
    let settings = await db.get('SELECT acceleration, maxSpeed, steering FROM Settings WHERE id = ?', id);
    
    if (!settings) {
        await db.run('INSERT INTO Settings (id, acceleration, maxSpeed, steering) VALUES (?, ?, ?, ?)',
            id, 0, 0, 0);
        settings = {
            acceleration: 0,
            maxSpeed: 0,
            steering: 0
        };
    }

    await db.close();
    return settings;
}