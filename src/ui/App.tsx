import {BoxItem} from "./boxed.ts";
import Items from "./Items.tsx";
import {Branch, Enchantment, getBestBranch} from "../data/anvil.ts";
import Calculation from "./Calculation.tsx";
import BackgroundWorker from "../bgworker?worker";
import {attachDeep, get, List, mutateList, setState, State} from "aena/state";
import {insertToString} from "aena";

const ITEM_SEPARATOR = "---";

export default function App() {
    const url = new URL(location.href);
    const worker = new BackgroundWorker();
    const items = new List<BoxItem>();

    attachDeep(items, () => {
        url.searchParams.set("items", get(items).map(item => item.toString()).join(ITEM_SEPARATOR));

        history.replaceState({}, "", url);
    });

    const itemsString = url.searchParams.get("items");
    if(itemsString && itemsString.length > 0)
        mutateList(items, get(items).length, 0, ...itemsString.split(ITEM_SEPARATOR).map(BoxItem.from));

    const lastCalculation = new State<Branch | undefined | string>(undefined);

    worker.onmessage = (message: MessageEvent<Set<Branch> | string>) =>
        setState(lastCalculation, typeof message.data === "string"
            ? message.data
            : getBestBranch(message.data));

    return (
        <>
            <header className={"flex w-full justify-center sticky top-0 left-0 bg-shade-0 z-30"}>
                <div className={"flex max-w-screen-md w-full p-6 items-center gap-4"}>
                    <h1 className={"font-semibold text-shade-4 text-2xl"}>MC Anvil Combinator <span
                        className={"text-shade-2"}>V2</span></h1>
                    <button
                        className={"ml-auto px-3 py-0.5 rounded-lg bg-shade-4 text-shade-1 hover:bg-shade-3 transition font-semibold"}
                        onclick={() => {
                            window.scrollTo({top: 0, behavior: "smooth"});

                            worker.postMessage(get(items).map(item => ({
                                kind: get(item.kind),
                                enchantments: get(item.enchantments).reduce(
                                    (enchantments, enchantment) => enchantments.add({
                                        kind: get(enchantment.kind),
                                        level: get(enchantment.level)
                                    }),
                                    new Set<Enchantment>()
                                ),
                                priorWorkPenalty: 0
                            })));
                        }}
                    >Calculate
                    </button>
                </div>
            </header>
            <main className={"max-w-full px-6"}>
                <Calculation lastCalculation={lastCalculation}/>
            </main>
            <main className={"w-full px-6 max-w-screen-md"}>
                <h2 className={"mb-4 font-semibold text-shade-4 text-xl"}>Items ({insertToString(items, items => `${items.length}`)})</h2>
                <Items items={items}/>
            </main>
            <footer className={"mt-auto py-6 text-sm"}>
                © {new Date().getFullYear()} Tobias Hillemanns | <a href="https://github.com/trombecher/mc-anvil-combinator-v2" className={"underline"}>GitHub</a>
            </footer>
        </>
    );
}