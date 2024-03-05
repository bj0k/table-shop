import { initTableShopDb } from "$lib/db";
import { refeshFromDb } from "$lib/store/random_table";

export const ssr = false;

export async function load() {
  await initTableShopDb();
  await refeshFromDb();
  return {};
}
