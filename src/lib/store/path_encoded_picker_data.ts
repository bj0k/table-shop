import type { GeneratorDataType } from "$lib/picker";
import JSONCrush from "jsoncrush";
import { writable } from "svelte/store";

export type CrushedPageParams = {
  d: GeneratorDataType;
  t: string;
};

export const TABLESHOP_PICKER_PAGE_DATA = `tableshop/picker/page_data`;

export const savedPickerPageData = writable(
  localStorage.getItem(TABLESHOP_PICKER_PAGE_DATA) || `('d!()~t!'')_`,
);

export function updatePageData(
  tmpl: string,
  bag: CrushedPageParams["d"],
): void {
  const encodedCrushedString = encodeURIComponent(
    JSONCrush.crush(
      JSON.stringify({
        d: bag,
        t: tmpl,
      }),
    ),
  );

  savedPickerPageData.set(encodedCrushedString);
  localStorage.setItem(TABLESHOP_PICKER_PAGE_DATA, encodedCrushedString);
}
