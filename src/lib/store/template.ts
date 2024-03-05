import { writable } from "svelte/store";
import type { TemplateBody } from "$lib/template";

export type TemplateStore = Record<string, TemplateBody>;

export const templates = writable<TemplateStore>({});
