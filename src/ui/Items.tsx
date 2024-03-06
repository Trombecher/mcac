import {BoxArray, Box} from "aena";
import {insertBoxSet, insertBox, insertBoxToString, insertBoxArray} from "aena/glue";
import {BoxItem} from "./boxed";
import {enchantmentData, ItemKind} from "../data/db";
import {roman} from "../data/constants";

function UIItem({
    item,
    items
}: {
    item: BoxItem
    items: BoxArray<BoxItem>
}) {
    const disabled = item.notYetAppliedEnchantments.derive(arr => arr.length === 0);
    const options = item.kind.derive(kind => {
        const options = Object.values(ItemKind);
        options.splice(options.indexOf(kind), 1);
        options.sort();
        return options;
    });

    const distributeDisabled = new Box(item.enchantments.size === 0);
    item.enchantments.addListener(() => distributeDisabled.value = item.enchantments.size === 0);

    return (
        <div class={"p-4 border border-shade-2 rounded-xl mb-4 bg-shade-1"}>
            <div class={"flex gap-4 items-center"}>
                <img
                    alt={""}
                    src={item.kind.derive(kind => `${kind.toLowerCase().replaceAll(" ", "_")}.png`)}
                    width={64}
                    height={64}
                    class={"[image-rendering:pixelated]"}
                />
                <SelectBox
                    options={options}
                    optionMapper={i => i}
                    selected={item.kind}
                />
                <button
                    class={"border border-shade-2 px-3 py-0.5 rounded-lg enabled:hover:bg-shade-2 transition disabled:text-shade-2"}
                    disabled={distributeDisabled}
                    onclick={() => {
                        item.enchantments.forEach(enchantment => {
                            item.enchantments.delete(enchantment);

                            const book = new BoxItem();
                            book.enchantments.add(enchantment);

                            items.push(book);
                        });
                    }}
                >Distribute
                </button>
                <button
                    onclick={() => items.splice(items.indexOf(item), 1)}
                    class={"ml-auto p-1 hover:bg-shade-2 transition rounded-lg"}
                >
                    <Bin/>
                </button>
            </div>
            {insertBoxSet(item.enchantments, boxEnchantment => (
                <div class={"flex gap-4 my-3"}>
                    <SelectBox
                        options={item.notYetAppliedEnchantments}
                        selected={boxEnchantment.kind}
                        optionMapper={k => k}
                    />
                    <SelectBox
                        options={boxEnchantment.kind.derive(kind =>
                            (new Array(enchantmentData[kind].maxLevel))
                                .fill(0)
                                .map((_, i) => i + 1))}
                        selected={boxEnchantment.level}
                        optionMapper={option => roman[option as keyof typeof roman]}
                    />
                    <button
                        class={"ml-auto hover:bg-shade-2 transition rounded-lg p-1"}
                        onclick={() => item.enchantments.delete(boxEnchantment)}
                    >
                        <Bin/>
                    </button>
                </div>
            ))}
            <button
                onclick={() => item.addRandomEnchantment()}
                class={"hover:enabled:bg-shade-0 mt-3 disabled:text-shade-1 transition w-full border border-dashed border-shade-2 rounded-lg text-sm py-1 font-semibold"}
                disabled={disabled}
            >+ Add Enchantment
            </button>
        </div>
    );
}

function SelectBox<T>({
    options,
    optionMapper,
    selected,
}: {
    options: Readonly<Box<T[]>>,
    optionMapper: (option: T) => string,
    selected: Box<T>,
}) {
    const open = new Box(false);
    open.addListener(current => {
        if(!current) return;
        document.onmousedown = ({target}) => {
            if(target === selectBox || selectBox.contains(target as Node)) return;
            open.value = false;
            document.onmousedown = null;
        };
    });

    const selectBox = (
        <div class={"relative"}>
            <button
                onclick={() => open.value = !open.value}
                class={open.derive(open => `${open ? "bg-shade-2" : ""} transition py-0.5 px-3 rounded-lg border-shade-2 border`)}
            >{insertBoxToString(selected, optionMapper)}</button>
            <div
                class={open.derive(open => `${open ? "" : "hidden"} shadow-[#000] shadow-2xl max-h-96 z-50 mt-1 w-64 absolute top-full left-0 bg-shade-1 border border-shade-2 py-1 rounded-lg overflow-x-hidden`)}
            >
                {insertBox(options, options => options.map(option => (
                    <button
                        class={"block px-3 hover:bg-shade-2 w-full text-left py-0.5"}
                        onclick={() => {
                            selected.value = option;
                            open.value = false;
                        }}
                    >{optionMapper(option)}</button>
                )))}
            </div>
        </div>
    ) as Node;

    return selectBox;
}

export default function Items({items}: {items: BoxArray<BoxItem>}) {
    return (
        <>
            {insertBoxArray(items, item => (
                <UIItem item={item} items={items}/>
            ))}
            <div>
                <button
                    onclick={() => items.push(new BoxItem())}
                    class={"hover:bg-shade-1 transition font-semibold text-center block w-full py-2 border border-dashed rounded-xl border-shade-2"}
                >+ Add Item
                </button>
            </div>
        </>
    );
}

function Bin() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" class={"fill-shade-3"} viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 2l-2 0a1 1 0 00-1 1l-6 0a1 1 0 100 2l18 0a1 1 0 100-2l-6 0a1 1 0 00-1-1ZM3 7 5 20C5.1538 21 6 22 7 22L17 22C18 22 18.8462 21 19 20L21 7Z"/>
        </svg>
    );
}