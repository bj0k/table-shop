import { rand as procedraRand } from "procedra";

export function randomInt(base: number): number {
  return Math.random() * base | 0;
}

type RollParams = {
  face: number;
  size: number;
};

export type DieFace = "d100" | "d20" | "d10" | "d8" | "d6" | "d4";

export class Roll {
  roll(params: RollParams): Array<number> {
    const result = new Array(params.size);
    for (let i = 0; i < params.size; i++) {
      result[i] = randomInt(params.face) + 1;
    }

    return result;
  }

  d1000(size: number) {
    return this.roll({ face: 1000, size });
  }

  d100(size: number) {
    return this.roll({ face: 100, size });
  }

  d20(size: number) {
    return this.roll({ face: 20, size });
  }

  d12(size: number) {
    return this.roll({ face: 12, size });
  }

  d10(size: number) {
    return this.roll({ face: 10, size });
  }

  d8(size: number) {
    return this.roll({ face: 8, size });
  }

  d6(size: number) {
    return this.roll({ face: 6, size });
  }

  d4(size: number) {
    return this.roll({ face: 4, size });
  }
}

export const diceBot = new Roll();

export type DiceBotCommandParam = {
  count: number;
  face: DieFace;
  modifiers?: number[];
};

export function quickDice(
  count: number,
  face: DieFace,
  modifiers: number[] = [],
) {
  return commandDiceBot(diceBot, count, face, modifiers);
}

export function commandDiceBot(
  myBot: Roll,
  count: number,
  face: DieFace,
  modifiers: number[],
) {
  const nums = myBot[face](count);

  const naturalTotal = nums.reduce((a, b) => a + b, 0);
  const modTotal = modifiers.reduce((a, b) => a + b, 0);

  return {
    count,
    face,
    modifiers,
    result: {
      natural: nums,
      total: naturalTotal + modTotal,
    },
  };
}

export function parseDice(input: string) {
  return procedraRand.parse(input);
}

export type DicePool = ReturnType<typeof procedraRand.parse>;

export function evaluateDice(pool: DicePool): number[] {
  const values = [];
  for (let i = 0; i < pool.count; i++) {
    values.push(procedraRand.nextInt(pool.face) + 1);
  }
  return values;
}
