import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import { SQLite } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  databaseObj: SQLiteObject;
  tables = {
    categories: 'categories',
    persons: 'persons',
  };

  constructor(private sqlite: SQLite) {}

  async createDatabase() {
    await this.sqlite
      .create({
        name: 'ionic_sqlite_crud',
        location: 'default',
      })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
      })
      .catch((err) => {
        alert('error on creating database' + JSON.stringify(err));
      });

    await this.createTables();
  }

  async createTables() {
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.categories} (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(255) NOT NULL UNIQUE)`,
      []
    );

    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.persons} (id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER UNSIGNED NOT NULL, name VARCHAR(255) NOT NULL)`,
      []
    );
  }

  async addCategory(name: string) {
    return this.databaseObj
      .executeSql(
        `INSERT INTO ${this.tables.categories} (name) VALUES ('${name}')`,
        []
      )
      .then(() => {
        return 'category created';
      })
      .catch((err) => {
        if (err.code === 6) {
          return 'category already exists!';
        }

        return 'error on creating category ' + JSON.stringify(err);
      });
  }

  async getCategories() {
    return this.databaseObj
      .executeSql(
        `SELECT * FROM ${this.tables.categories} ORDER BY name ASC`,
        []
      )
      .then((res) => {
        return res;
      })
      .catch((err) => {
        return 'error on getting categories ' + JSON.stringify(err);
      });
  }

  async deleteCategory(id: number) {
    return this.databaseObj
      .executeSql(`DELETE FROM ${this.tables.categories} WHERE id = ${id}`, [])
      .then(() => {
        return 'category deleted';
      })
      .then((err) => {
        return 'error on deleting category ' + JSON.stringify(err);
      });
  }

  async editCategory(name: string, id: number) {
    return this.databaseObj
      .executeSql(
        `UPDATE ${this.tables.categories} SET name = '${name}' WHERE id = ${id}`,
        []
      )
      .then(() => {
        return 'category updated';
      })
      .catch((err) => {
        if (err.code === 6) {
          return 'category already exist';
        }

        return 'error on updating category ' + JSON.stringify(err);
      });
  }
}
