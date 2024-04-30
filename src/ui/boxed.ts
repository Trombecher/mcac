import {enchantmentData, EnchantmentKind, enchantmentsApplicableToItem, ItemKind} from "../data/db";
import {attach, get, List, mutateList, setState, State} from "aena/state";

export class BoxEnchantment {
    readonly kind: State<EnchantmentKind>;
    readonly level: State<number>;

    constructor(kind: EnchantmentKind, level = enchantmentData[kind].maxLevel) {
        this.kind = new State(kind);
        this.level = new State(level);

        attach(this.kind, kind =>
            setState(this.level, enchantmentData[kind].maxLevel));
    }
}

const CONTENT_SEPARATOR = "--";
const ENCHANTMENT_SEPARATOR = "-";

export class BoxItem {
    readonly kind: State<ItemKind>;
    readonly enchantments = new List<BoxEnchantment>();
    readonly notYetAppliedEnchantments: State<EnchantmentKind[]>;

    constructor(kind = ItemKind.Book) {
        this.kind = new State(kind);

        attach(this.kind, itemKind => {
            if(get(this.kind) === ItemKind.Book) return;

            // Delete every enchantment that is not applicable to the new item kind.
            for(let i = 0; i < get(this.enchantments).length;) {
                if(enchantmentData[get(get(this.enchantments)[i].kind)].applicableToBookAnd.has(itemKind))
                    i++
                else mutateList(this.enchantments, i, 1);
            }
        });

        const generateNYAE = () => {
            const applicableEnchantments = enchantmentsApplicableToItem.get(get(this.kind))!;
            const nyae = [...applicableEnchantments].filter(e => {
                const kindsIncompatible = enchantmentData[e].incompatibleWith;
                return !this.hasEnchantmentKind(e) && [...kindsIncompatible].every(incompatible => !this.hasEnchantmentKind(incompatible));
            });

            nyae.sort();

            return nyae;
        };

        const nyae = new State(generateNYAE());
        this.notYetAppliedEnchantments = nyae;

        const updateNYAE = () => setState(nyae, generateNYAE());

        attach(this.kind, updateNYAE);
        attach(this.enchantments, updateNYAE);
    }

    hasEnchantmentKind(kind: EnchantmentKind): boolean {
        return get(this.enchantments)
            .some(be => get(be.kind) === kind);
    }

    addRandomEnchantment() {
        const [kind] = get(this.notYetAppliedEnchantments);
        if(!kind) return;
        mutateList(
            this.enchantments,
            get(this.enchantments).length,
            0,
            new BoxEnchantment(kind)
        );
    }

    toString() {
        let s = get(this.kind) as string;
        get(this.enchantments).forEach(enchantment =>
            s += `${CONTENT_SEPARATOR}${get(enchantment.kind)}${ENCHANTMENT_SEPARATOR}${get(enchantment.level)}`);
        return s;
    }

    static from(s: string) {
        const [itemKind, ...enchantments] = s.split(CONTENT_SEPARATOR);
        const item = new BoxItem(itemKind as ItemKind);
        enchantments.forEach(enchantment => {
            const [kind, level] = enchantment.split(ENCHANTMENT_SEPARATOR);
            mutateList(
                item.enchantments,
                get(item.enchantments).length,
                0,
                new BoxEnchantment(kind as EnchantmentKind, +level))
        });
        return item;
    }
}