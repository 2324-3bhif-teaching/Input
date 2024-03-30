import { Database as Driver} from "sqlite3";
import { open, Database } from "sqlite";

export const dbFileName = './Database/Users.db';

export class DB {
    public static async createDBConnection(): Promise<Database> {
        const db = await open({
            filename: `${dbFileName}`,
            driver: Driver
        });
        await db.run('PRAGMA foreign_keys = ON');
        await this.ensureTablesCreated(db);
        return db;
    }

    public static async beginTransaction(connection: Database): Promise<void> {
        await connection.run('begin transaction;');
    }

    public static async commitTransaction(connection: Database): Promise<void> {
        await connection.run('commit;');
    }

    public static async rollbackTransaction(connection: Database): Promise<void> {
        await connection.run('rollback;');
    }

    private static async ensureTablesCreated(connection: Database): Promise<void> {

        await connection.run(`CREATE TABLE CONTROLLS (
        id INTEGER PRIMARY KEY
        )strict `);

        await connection.run(`CREATE TABLE USERS (
        id INTEGER PRIMARY KEY,
        username TEXT,
        password TEXT, 
        FOREIGN KEY (id) REFERENCES CONTROLLS(id)
        )strict `);
    }
}

DB.createDBConnection();