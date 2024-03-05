import type { DiceBotCommandParam } from "$lib/dice_bot";
import { quickDice } from "$lib/dice_bot";

const rangeRegex = /([\d]+)-([\d]+)/;

class RangeFormatError extends Error {}

export function parseRange(expr: string): number[] {
  const matches = rangeRegex.exec(expr);
  if (matches == null) {
    throw new RangeFormatError(`bad syntax: ${expr}`);
  } else {
    const [, beg, end] = matches;
    const num0 = parseInt10(beg);
    const num1 = parseInt10(end);
    if (isNaN(num0) || isNaN(num1)) {
      throw new RangeFormatError(
        `cannot convert to safe integer: ${num0}, ${num1}`,
      );
    }

    if (num1 <= num0) {
      return [];
    } else {
      const numbers = [];
      let i = num0;
      while (i < num1) {
        numbers.push(i);
        i++;
      }

      return numbers;
    }
  }
}

function parseInt10(digits: string): number {
  return parseInt(digits, 10);
}

class TableElement<T> {
  constructor(
    public start: number,
    public end: number,
    public value: T,
  ) {}
}

export class RandomTable<T> {
  constructor(
    public name: string,
    public dice: DiceBotCommandParam,
    public elements: TableElement<T>[] = [],
  ) {}

  addElement(start: number, end: number, value: T): this {
    const element = new TableElement(start, end, value);
    this.elements.push(element);

    return this;
  }

  addElements(elementDefs: { start: number; end: number; value: T }[]): this {
    elementDefs.forEach(({ start, end, value }) =>
      this.addElement(start, end, value)
    );

    return this;
  }

  findElement(number: number): TableElement<T> | undefined {
    return this.elements.find((element) =>
      element.start <= number && number <= element.end
    );
  }

  find(number: number): T | undefined {
    const element = this.findElement(number);
    return element ? element.value : undefined;
  }

  nextElement(): TableElement<T> | undefined {
    const roll = quickDice(
      this.dice.count,
      this.dice.face,
      this.dice.modifiers,
    );
    return this.findElement(roll.result.total);
  }

  nextValue(): T | undefined {
    return this.nextElement()?.value;
  }
}

export type RandomTableInit = {
  tableName: string;
  dice: DiceBotCommandParam;
  items: { start: number; end: number; value: string | object }[];
};

export function createRandomTable(
  init: RandomTableInit,
): RandomTable<string | object> {
  const rt = new RandomTable<string | object>(init.tableName, init.dice);

  for (const item of init.items) {
    rt.addElement(item.start, item.end, item.value);
  }

  return rt;
}

export function convertRandomTableFrom<T, U>(
  tableName: string,
  dice: DiceBotCommandParam,
  source: U[],
  converter: (entry: U) => { start: number; end: number; value: T },
): RandomTable<T> {
  const rt = new RandomTable<T>(tableName, dice);

  for (const entry of source) {
    const elem = converter(entry);
    rt.addElement(elem.start, elem.end, elem.value);
  }

  return rt;
}
