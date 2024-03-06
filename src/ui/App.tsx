import {BoxArray, Box} from "aena";
import {BoxItem} from "./boxed.ts";
import Items from "./Items.tsx";
import {Branch, Enchantment, getBestBranch} from "../data/anvil.ts";
import Calculation from "./Calculation.tsx";
import BackgroundWorker from "../bgworker?worker";
import {insertBoxAsText} from "aena/glue";

const ITEM_SEPARATOR = "---";

export default function App() {
    const url = new URL(window.location.href);
    const worker = new BackgroundWorker();
    const items = new BoxArray<BoxItem>();
    const itemCount = new Box(0);
    items.addListener(() => itemCount.value = items.length);

    items.addDeepListener(() => {
        url.searchParams.set("items", items.map(item => item.toString()).join(ITEM_SEPARATOR));

        history.replaceState({}, "", url);
    });

    const itemsString = url.searchParams.get("items");
    if(itemsString && itemsString.length > 0)
        itemsString
            .split(ITEM_SEPARATOR)
            .forEach(item => items.push(BoxItem.from(item)));

    const lastCalculation = new Box<Branch | undefined | string>(undefined);

    worker.onmessage = (message: MessageEvent<Set<Branch> | string>) =>
        lastCalculation.value = typeof message.data === "string"
            ? message.data
            : getBestBranch(message.data);

    return (
        <>
            <header class={"flex w-full justify-center sticky top-0 left-0 bg-shade-0 z-30"}>
                <div class={"flex max-w-screen-md w-full p-6 items-center gap-4"}>
                    <h1 class={"font-semibold text-shade-4 text-2xl"}>MC Anvil Combinator <span
                        class={"text-shade-2"}>V2</span></h1>
                    <button
                        class={"ml-auto px-3 py-0.5 rounded-lg bg-shade-4 text-shade-1 hover:bg-shade-3 transition font-semibold"}
                        onclick={() => {
                            window.scrollTo({top: 0, behavior: "smooth"});

                            worker.postMessage(items.map(item => ({
                                kind: item.kind.value,
                                enchantments: item.enchantments.reduce(new Set<Enchantment>(),
                                    (enchantments, enchantment) => enchantments.add({
                                        kind: enchantment.kind.value,
                                        level: enchantment.level.value
                                    })
                                ),
                                priorWorkPenalty: 0
                            })));
                        }}
                    >Calculate
                    </button>
                </div>
            </header>
            <main class={"max-w-full px-6"}>
                <Calculation lastCalculation={lastCalculation}/>
            </main>
            <main class={"w-full px-6 max-w-screen-md"}>
                <h2 class={"mb-4 font-semibold text-shade-4 text-xl"}>Items ({insertBoxAsText(itemCount)})</h2>
                <Items items={items}/>
            </main>
            <footer class={"mt-auto py-6 text-sm"}>
                © {new Date().getFullYear()} Tobias Hillemanns | <a href="https://github.com/trombecher/mc-anvil-combinator-v2" class={"underline"}>GitHub</a>
            </footer>
        </>
    );
}