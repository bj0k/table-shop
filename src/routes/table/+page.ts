import { initTableShopDb } from "$lib/db";
import { restoreTableDefState } from "$lib/store/random_table";
import { restoreTemplateDefState } from "$lib/store/template";

export const ssr = false;

async function restoreLocalStores() {
  await restoreTableDefState();
  await restoreTemplateDefState();
}

export async function load() {
  await initTableShopDb();
  await restoreLocalStores();
  return {};
}
