import {enchantmentData, EnchantmentKind, ItemKind} from "./db.ts";
import {POWER_SETS} from "./distribution.ts";

export enum ErrorCode {
    AtLeastTwoItemsRequired = "At least two items are required.",
    ItemsAreIncompatible= "Two Items are incompatible."
}

export type Enchantment = {
    kind: EnchantmentKind,
    level: number
};

export class Item {
    readonly enchantments = new Set<Enchantment>();
    priorWorkPenalty = 0;
    kind: ItemKind;

    constructor(kind: ItemKind) {
        this.kind = kind;
    }
}

export type Step = {
    target: Item,
    sacrifice: Item,
    result: Item,
    cost: number
};

export type Branch = {
    steps: Step[],
    totalCost: number
};

function combine(target: Item, sacrifice: Item): Step | ErrorCode {
    if(target.kind !== sacrifice.kind && sacrifice.kind !== ItemKind.Book)
        return ErrorCode.ItemsAreIncompatible;

    const result = new Item(target.kind);
    let cost = target.priorWorkPenalty + sacrifice.priorWorkPenalty;

    // const pack = target.pack() + sacrifice.pack();
    // const lookup = cache.get(pack);
    // if(lookup) {
    //     step.result.enchantments.push(...lookup.result.enchantments);
    //     step.result.priorWorkPenalty = Math.max(target.priorWorkPenalty, sacrifice.priorWorkPenalty) * 2 + 1;
    //     step.cost = lookup.cost
    //         - lookup.target.priorWorkPenalty
    //         - lookup.sacrifice.priorWorkPenalty
    //         + step.target.priorWorkPenalty
    //         + step.sacrifice.priorWorkPenalty;
    //     return step;
    // }

    target.enchantments.forEach(enchantment => result.enchantments.add(enchantment));
    result.priorWorkPenalty = Math.max(target.priorWorkPenalty, sacrifice.priorWorkPenalty) * 2 + 1;

    se: for(const sacrificeEnchantment of sacrifice.enchantments) {
        const applicableToBookAnd = enchantmentData[sacrificeEnchantment.kind].applicableToBookAnd;
        const incompatibleWith = enchantmentData[sacrificeEnchantment.kind].incompatibleWith;

        if(target.kind !== ItemKind.Book && !applicableToBookAnd.has(target.kind))
            continue;

        let match: Enchantment | null = null;

        for(const targetEnchantment of target.enchantments) {
            if(incompatibleWith.has(targetEnchantment.kind)) {
                ++cost;
                break se;
            }

            if(targetEnchantment.kind === sacrificeEnchantment.kind) {
                match = targetEnchantment;
                break;
            }
        }

        if(match) {
            const resultEnchantment = structuredClone(match);

            if(resultEnchantment.level < sacrificeEnchantment.level)
                resultEnchantment.level = sacrificeEnchantment.level;
            else if(resultEnchantment.level === sacrificeEnchantment.level
                && resultEnchantment.level < enchantmentData[resultEnchantment.kind].maxLevel) {
                ++resultEnchantment.level;
            }

            cost += (
                sacrifice.kind == ItemKind.Book
                    ? Math.ceil(enchantmentData[sacrificeEnchantment.kind].itemMultiplier / 2)
                    : enchantmentData[sacrificeEnchantment.kind].itemMultiplier
            ) * sacrificeEnchantment.level;

            result.enchantments.add(resultEnchantment);
        } else {
            cost += (
                sacrifice.kind == ItemKind.Book
                    ? Math.ceil(enchantmentData[sacrificeEnchantment.kind].itemMultiplier / 2)
                    : enchantmentData[sacrificeEnchantment.kind].itemMultiplier
            ) * sacrificeEnchantment.level;

            result.enchantments.add(structuredClone(sacrificeEnchantment));
        }
    }

    // cache.set(pack, step);

    return {cost, result, sacrifice, target};
}

function branchOfTwo(firstItem: Item, secondItem: Item): Branch | ErrorCode {
    const firstWithSecond = combine(firstItem, secondItem);
    const secondWithFirst = combine(secondItem, firstItem);

    if(typeof firstWithSecond === "string") {
        if(typeof secondWithFirst === "string") return secondWithFirst;
        return {
            steps: [secondWithFirst],
            totalCost: secondWithFirst.cost
        };
    }
    if(typeof secondWithFirst === "string") return {
        steps: [firstWithSecond],
        totalCost: firstWithSecond.cost
    };

    const bestStep = firstWithSecond.cost < secondWithFirst.cost
        ? firstWithSecond
        : secondWithFirst;

    return {
        steps: [bestStep],
        totalCost: bestStep.cost
    };
}

export function generateBranches(items: Item[]): Set<Branch> | ErrorCode {
    if(items.length < 2) return ErrorCode.AtLeastTwoItemsRequired;

    if(items.length === 2) {
        const branch = branchOfTwo(items[0]!, items[1]!);
        if(typeof branch === "string") return branch;
        return new Set<Branch>().add(branch);
    }

    const branches = new Set<Branch>();

    for(const [leftIndices, rightIndices] of POWER_SETS[items.length - 3]) {
        const leftItems = leftIndices.map(index => items[index]);

        const leftHasOneItem = leftIndices.length === 1;
        const leftBranches = leftHasOneItem
            ? new Set<Branch>().add({
                totalCost: 0,
                steps: []
            })
            : generateBranches(leftItems);
        if(typeof leftBranches === "string") return leftBranches;

        const rightItems = rightIndices.map(index => items[index]);

        const rightBranches = generateBranches(rightItems);
        if(typeof rightBranches === "string") return rightBranches;

        leftBranches.forEach(leftBranch => {
            rightBranches.forEach(rightBranch => {
                const firstItem = leftHasOneItem
                    ? leftItems[0]!
                    : leftBranch.steps.at(-1)!.result;
                const secondItem = rightBranch.steps.at(-1)!.result;

                const newBranch = branchOfTwo(firstItem, secondItem);
                if(typeof newBranch === "string") return newBranch;

                const lastStep = newBranch.steps.pop()!;
                newBranch.steps.push(...leftBranch.steps);
                newBranch.steps.push(...rightBranch.steps);
                newBranch.steps.push(lastStep);
                newBranch.totalCost += leftBranch.totalCost + rightBranch.totalCost;

                branches.add(newBranch);
            });
        });
    }

    return branches;
}

export function getBestBranch(branches: Set<Branch>): Branch | undefined {
    let bestBranch: Branch | undefined;
    branches.forEach(branch => {
        if(!bestBranch || (branch.totalCost < bestBranch.totalCost))
            bestBranch = branch;
    });
    return bestBranch;
}