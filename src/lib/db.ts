import { Dexie } from "dexie";
import type { Table } from "dexie";
import type { RandomTableInit } from "$lib/random_table";

export const TABLE_SHOP_LEVEL_ROOT = `tableshop`;
export const TABLE_SHOP_DB_VERSION = 1;
export const TABLE_SHOP_SUBLEVEL_RANDOM = `random_table`;
export const TABLE_SHOP_SUBLEVEL_TMPL = `template`;

export interface RandomTableEntity {
  id?: number;
  key: string;
  body: RandomTableInit;
}

export interface TemplateEntity {
  id?: number;
  content: string;
}

export class MyDexie extends Dexie {
  randomTables!: Table<RandomTableEntity>;
  templates!: Table<TemplateEntity>;

  constructor() {
    super(TABLE_SHOP_LEVEL_ROOT);
    this.version(TABLE_SHOP_DB_VERSION).stores({
      randomTables: `++id, key, body`,
      templates: `++id, content`,
    });
  }
}

let db: MyDexie;

export async function initTableShopDb() {
  if (db == null) {
    db = new MyDexie();
  }

  return db;
}

export async function saveNewTableDef(
  tableKey: string,
  randomTable: RandomTableInit,
) {
  return await db.randomTables.add({
    key: tableKey,
    body: randomTable,
  });
}

export async function loadTableDef(
  tableKey: string,
) {
  return db.randomTables.get(tableKey);
}

export async function listAllTableDefs() {
  return db.randomTables.toArray();
}

// async function _runDb<T>(action: (state: typeof db) => Promise<T>): Promise<T> {
//   if (db == null) await initTableShopDb();

//   return await action(db);
// }