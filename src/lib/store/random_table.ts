import { writable } from "svelte/store";
import * as DB from "$lib/db";
import {
  createRandomTable,
  type RandomTable,
  type RandomTableInit,
} from "$lib/random_table";

export type MyTable = RandomTable<string | object>;

export type TableStore = Record<string, MyTable>;

export const randomTables = writable<TableStore>({});

export function addTable(tableKey: string, init: RandomTableInit) {
  const table = createRandomTable(init);
  randomTables.update((state) => {
    state[tableKey] = table;
    return state;
  });
  Promise.resolve().then(async () => {
    await DB.saveNewTableDef(tableKey, init);
  });
}

export async function restoreTableDefState() {
  const itemsFromDb = await DB.listAllTableDefs();
  const loadedTables = itemsFromDb.reduce((loader, entity) => {
    loader[entity.key] = createRandomTable(entity.body);
    return loader;
  }, {} as TableStore);

  randomTables.update(() => loadedTables);
}
