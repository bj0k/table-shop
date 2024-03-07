export function pick<T>(source: T[]): T {
  const a = (Math.random() * source.length) | 0;
  return source[a];
}

export type GeneratorValueType = string | object;

export type GeneratorDataType =
  | Record<string, GeneratorValueType[]>
  | Map<string, GeneratorValueType[]>;

export type GeneratorInit = {
  data: GeneratorDataType;
};

export interface RandomPicker {
  keys: string[];
  source: PickerSource;
}

export interface PickerSource {
  lookup(name: string): string | object;
}

class MapPickerSource implements PickerSource {
  constructor(public data: Map<string, GeneratorValueType[]>) {}

  lookup(name: string): string | object {
    const values = this.data.get(name)!;
    return pick(values);
  }
}

class RecordPickerSource implements PickerSource {
  constructor(public data: Record<string, GeneratorValueType[]>) {}

  lookup(name: string): string | object {
    const values = this.data[name]!;
    return pick(values);
  }
}

export function makeRandomPicker(generatorInit: GeneratorInit): RandomPicker {
  const keys = Object.keys(generatorInit.data);
  const source = generatorInit.data instanceof Map
    ? new MapPickerSource(generatorInit.data)
    : new RecordPickerSource(generatorInit.data);

  return {
    keys,
    source,
  };
}
