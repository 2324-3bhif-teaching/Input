import sqlite, { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbFileName = 'Users.db';

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
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                acceleration INTEGER,
                maxSpeed INTEGER,
                steering TEXT
            );
        `);
        this.initialTableCreationDone = true;
    }
}

export default DB;

async function saveSettings(acceleration: number, maxSpeed: number, steering: string) {
    const db = await DB.createDBConnection();
    await db.run(`INSERT INTO Settings (acceleration, maxSpeed, steering) VALUES (?, ?, ?)`,
        acceleration, maxSpeed, steering);
    await db.close();
}

document.addEventListener("DOMContentLoaded", () => {
    const modal: HTMLElement = document.getElementById("myModal")!;
    const btn: HTMLElement = document.getElementById("openModal")!;
    const span: HTMLElement = document.getElementsByClassName("close")[0] as HTMLElement;
    const form: HTMLFormElement = document.querySelector(".control-panel")!;
    
    btn.onclick = function() {
        modal.style.display = "block";
    }
    
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    window.onclick = function(event: MouseEvent) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    form.onsubmit = async function(event: Event) {
        event.preventDefault();
        const acceleration = parseInt((document.getElementById("acceleration") as HTMLInputElement).value);
        const maxSpeed = parseInt((document.getElementById("maxSpeed") as HTMLInputElement).value);
        const steering = (document.getElementById("steering") as HTMLInputElement).value;

        await saveSettings(acceleration, maxSpeed, steering);
        modal.style.display = "none";
    }
});



