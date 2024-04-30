import {BoxItem} from "./boxed";
import {enchantmentData, ItemKind} from "../data/db";
import {roman} from "../data/constants";
import {attach, derive, get, List, mutateList, setState, State} from "aena/state";
import {insert, insertList, insertToString} from "aena";

function UIItem({
                    item,
                    items,
                }: {
    item: BoxItem
    items: List<BoxItem>
}) {
    const disabled = derive(item.notYetAppliedEnchantments, arr => arr.length === 0);
    const options = derive(item.kind, kind => {
        const options = Object.values(ItemKind);
        options.splice(options.indexOf(kind), 1);
        options.sort();
        return options;
    });

    const distributeDisabled = derive(
        item.enchantments,
        enchantments => enchantments.length === 0,
    );

    return (
        <div className={"p-4 border border-shade-2 rounded-xl mb-4 bg-shade-1"}>
            <div className={"flex gap-4 items-center"}>
                <img
                    alt={""}
                    src={derive(item.kind, kind => `${kind.toLowerCase().replaceAll(" ", "_")}.png`)}
                    width={64}
                    height={64}
                    className={"[image-rendering:pixelated]"}
                />
                <SelectBox
                    options={options}
                    optionMapper={i => i}
                    selected={item.kind}
                />
                <button
                    className={"border border-shade-2 px-3 py-0.5 rounded-lg enabled:hover:bg-shade-2 transition disabled:text-shade-2"}
                    disabled={distributeDisabled}
                    onclick={() => {
                        get(item.enchantments).forEach(enchantment => {
                            const book = new BoxItem();
                            mutateList(book.enchantments, get(book.enchantments).length, 0, enchantment);

                            mutateList(items, get(items).length, 0, book);
                        });

                        mutateList(item.enchantments, 0, get(item.enchantments).length);
                    }}
                >Distribute
                </button>
                <button
                    onclick={() => mutateList(items, get(items).indexOf(item), 1)}
                    className={"ml-auto p-1 hover:bg-shade-2 transition rounded-lg"}
                >
                    <Bin/>
                </button>
            </div>
            {insertList(item.enchantments, boxEnchantment => (
                <div className={"flex gap-4 my-3"}>
                    <SelectBox
                        options={item.notYetAppliedEnchantments}
                        selected={boxEnchantment.kind}
                        optionMapper={k => k}
                    />
                    <SelectBox
                        options={derive(boxEnchantment.kind, kind =>
                            (new Array(enchantmentData[kind].maxLevel))
                                .fill(0)
                                .map((_, i) => i + 1))}
                        selected={boxEnchantment.level}
                        optionMapper={option => roman[option as keyof typeof roman]}
                    />
                    <button
                        className={"ml-auto hover:bg-shade-2 transition rounded-lg p-1"}
                        onclick={() => mutateList(
                            item.enchantments,
                            get(item.enchantments).indexOf(boxEnchantment),
                            1
                        )}
                    >
                        <Bin/>
                    </button>
                </div>
            ))}
            <button
                onclick={() => item.addRandomEnchantment()}
                className={"hover:enabled:bg-shade-0 mt-3 disabled:text-shade-1 transition w-full border border-dashed border-shade-2 rounded-lg text-sm py-1 font-semibold"}
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
    options: State<T[]>,
    optionMapper: (option: T) => string,
    selected: State<T>,
}) {
    const open = new State(false);
    attach(open, current => {
        if(!current) return;
        document.onmousedown = ({target}) => {
            if(target === selectBox || selectBox.contains(target as Node)) return;
            setState(open, false);
            document.onmousedown = null;
        };
    });

    const selectBox = (
        <div className={"relative"}>
            <button
                onclick={() => setState(open, !get(open))}
                className={derive(open, open =>
                    `${open ? "bg-shade-2" : ""} transition py-0.5 px-3 rounded-lg border-shade-2 border`)}
            >{insertToString(selected, optionMapper)}</button>
            <div
                className={derive(open, open =>
                    `${open ? "" : "hidden"} shadow-[#000] shadow-2xl max-h-96 z-50 mt-1 w-64 absolute top-full left-0 bg-shade-1 border border-shade-2 py-1 rounded-lg overflow-x-hidden`)}
            >
                {insert(options, options => options.map(option => (
                    <button
                        className={"block px-3 hover:bg-shade-2 w-full text-left py-0.5"}
                        onclick={() => {
                            setState(selected, option);
                            setState(open, false);
                        }}
                    >{optionMapper(option)}</button>
                )))}
            </div>
        </div>
    ) as Node;

    return selectBox;
}

export default function Items({items}: {items: List<BoxItem>}) {
    return (
        <>
            {insertList(items, item => (
                <UIItem item={item} items={items}/>
            ))}
            <div>
                <button
                    onclick={() => mutateList(items, get(items).length, 0, new BoxItem())}
                    className={"hover:bg-shade-1 transition font-semibold text-center block w-full py-2 border border-dashed rounded-xl border-shade-2"}
                >+ Add Item
                </button>
            </div>
        </>
    );
}

function Bin() {
    return (
        <svg_ _class={"fill-shade-3"} _viewBox="0 0 24 24" _width="24" _height="24">
            <path_ _d="M12 2l-2 0a1 1 0 00-1 1l-6 0a1 1 0 100 2l18 0a1 1 0 100-2l-6 0a1 1 0 00-1-1ZM3 7 5 20C5.1538 21 6 22 7 22L17 22C18 22 18.8462 21 19 20L21 7Z"/>
        </svg_>
    );
}