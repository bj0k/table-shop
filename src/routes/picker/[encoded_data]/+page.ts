import JSONCrush from "jsoncrush";

export const ssr = false;

type CrushedPageParams = {
  d: Record<string, string | object>;
  t: string;
};

export function load({ params }): Partial<CrushedPageParams> {
  if (params.encoded_data) {
    const res = JSON.parse(
      JSONCrush.uncrush(decodeURIComponent(params.encoded_data)),
    );

    return res;
  }

  return {};
}
