import { writable } from "svelte/store";
import * as DB from "$lib/db";
import type { TemplateBody } from "$lib/template";

export type TemplateStore = Record<string, TemplateBody>;

export const templates = writable<TemplateStore>({});

export function addTemplate(
  templateKey: string,
  templateBody: TemplateBody,
): void {
  templates.update((state) => {
    state[templateKey] = templateBody;
    return state;
  });

  (async () => {
    await DB.saveTemplate(templateKey, templateBody);
  })();
}

export async function restoreTemplateDefState() {
  const itemsFromDb = await DB.listAllTemplates();
  const loadedTemplates = itemsFromDb.reduce((store, entity) => {
    store[entity.key] = entity.tmpl;
    return store;
  }, {} as TemplateStore);

  templates.update(() => loadedTemplates);
}
