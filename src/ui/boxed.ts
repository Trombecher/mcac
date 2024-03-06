import {Box, BoxSet} from "aena";
import {enchantmentData, EnchantmentKind, enchantmentsApplicableToItem, ItemKind} from "../data/db";

export class BoxEnchantment {
    readonly kind: Box<EnchantmentKind>;
    readonly level: Box<number>;

    constructor(kind: EnchantmentKind, level = enchantmentData[kind].maxLevel) {
        this.kind = new Box(kind);
        this.level = new Box(level);

        this.kind.addListener(kind =>
            this.level.value = enchantmentData[kind].maxLevel);
    }
}

const CONTENT_SEPARATOR = "--";
const ENCHANTMENT_SEPARATOR = "-";

export class BoxItem {
    readonly kind: Box<ItemKind>;
    readonly enchantments = new BoxSet<BoxEnchantment>();
    readonly notYetAppliedEnchantments: Readonly<Box<EnchantmentKind[]>>;

    constructor(kind = ItemKind.Book) {
        this.kind = new Box(kind);

        this.kind.addListener(itemKind => {
            // Delete every enchantment that is not applicable to the new item kind.
            this.enchantments.deleteIf(enchantment =>
                !enchantmentData[enchantment.kind.value].applicableToBookAnd.has(itemKind));
        });

        const generateNYAE = () => {
            const applicableEnchantments = enchantmentsApplicableToItem.get(this.kind.value)!;
            const nyae = [...applicableEnchantments].filter(e => {
                const kindsIncompatible = enchantmentData[e].incompatibleWith;
                return !this.hasEnchantmentKind(e) && [...kindsIncompatible].every(incompatible => !this.hasEnchantmentKind(incompatible));
            });

            nyae.sort();

            return nyae;
        };

        const nyae = new Box(generateNYAE());
        this.notYetAppliedEnchantments = nyae;

        const updateNYAE = () => nyae.value = generateNYAE();

        this.kind.addListener(updateNYAE);
        this.enchantments.addDeepListener(updateNYAE);
    }

    hasEnchantmentKind(kind: EnchantmentKind): boolean {
        for(const be of this.enchantments)
            if(be.kind.value === kind)
                return true;
        return false;
    }

    addRandomEnchantment() {
        const [kind] = this.notYetAppliedEnchantments.value;
        if(!kind) return;
        this.enchantments.add(new BoxEnchantment(kind));
    }

    toString() {
        let s = this.kind.value as string;
        this.enchantments.forEach(enchantment =>
            s += `${CONTENT_SEPARATOR}${enchantment.kind.value}${ENCHANTMENT_SEPARATOR}${enchantment.level.value}`);
        return s;
    }

    static from(s: string) {
        const [itemKind, ...enchantments] = s.split(CONTENT_SEPARATOR);
        const item = new BoxItem(itemKind as ItemKind);
        enchantments.forEach(enchantment => {
            const [kind, level] = enchantment.split(ENCHANTMENT_SEPARATOR);
            item.enchantments.add(new BoxEnchantment(kind as EnchantmentKind, +level));
        });
        return item;
    }
}