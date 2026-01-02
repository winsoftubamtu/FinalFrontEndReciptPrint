import { Injectable } from '@angular/core';
import {
  SQLiteConnection,
  SQLiteDBConnection,
  CapacitorSQLite
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class BillLocalService {
     private sqlite: SQLiteConnection;
  private db!: SQLiteDBConnection;

  constructor() {
    // ✅ Correct way to initialize
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async init() {
    const dbName = 'pos_db';

    // 1️⃣ Create or retrieve connection
    this.db = await this.sqlite.createConnection(
      dbName,
      false,   // encrypted
      'no-encryption',
      1,       // version
      false
    );

    // 2️⃣ Open DB
    await this.db.open();

    // 3️⃣ Create table
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS bills (
        table_no INTEGER PRIMARY KEY,
        data TEXT NOT NULL
      );
    `);
  }

  async saveBill(tableNo: number, bill: any) {
    const json = JSON.stringify(bill);
    await this.db.run(
      `INSERT OR REPLACE INTO bills (table_no, data) VALUES (?, ?)`,
      [tableNo, json]
    );
  }

  async getBill(tableNo: number): Promise<any | null> {
    const res = await this.db.query(
      `SELECT data FROM bills WHERE table_no = ?`,
      [tableNo]
    );

    return res.values?.length
      ? JSON.parse(res.values[0].data)
      : null;
  }

  async deleteBill(tableNo: number) {
    await this.db.run(
      `DELETE FROM bills WHERE table_no = ?`,
      [tableNo]
    );
  }
}
