import {MAX_SUPPORTED_ITEMS} from "./constants.ts";

const powerSetCache = new Map<string, number[][]>();

export function generatePowerSet(source: number[]) {
    if(source.length === 0) return [[]];
    const entry = powerSetCache.get(source.join("-"));
    if(entry) return entry;

    const powerSet = new Array<number[]>(2 ** source.length);
    const t = new Array(source.length - 1);

    for(let i = 1; i < source.length; i++)
        t[i - 1] = source[i];

    const pt = generatePowerSet(t);

    pt.forEach((c, i) => powerSet[i] = c);
    let powerSetIndex = pt.length;
    pt.forEach(element => powerSet[powerSetIndex++] = [source[0], ...element]);

    return powerSet;
}

export function generateCounterSet(set: number[], n: number) {
    const counterSet = new Array<number>(n - set.length);
    let index = 0;
    for(let i = 0; i < n; i++) {
        if(set.indexOf(i) === -1) {
            counterSet[index] = i;
            ++index;
        }
    }
    return counterSet;
}

export const POWER_SETS = new Array(MAX_SUPPORTED_ITEMS - 3)
    .fill(0)
    .map((_, n) => generatePowerSet(new Array(n + 3).fill(0).map((_, i) => i))
        .filter(set => set.length !== 0 && set.length <= (n + 3) / 2)
        .map(set => [set, generateCounterSet(set, (n + 3))] as const));