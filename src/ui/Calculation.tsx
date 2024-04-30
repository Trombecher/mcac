import {Branch, Item, Step} from "../data/anvil";
import {roman} from "../data/constants.ts";
import {JSX} from "aena/jsx-runtime";
import {setState, State} from "aena/state";
import {insert} from "aena";

export default function Calculation({lastCalculation}: {lastCalculation: State<Branch | string | undefined>}) {
    return insert(lastCalculation, value => {
        switch(typeof value) {
            case "string":
                return (
                    <Pad lastCalculation={lastCalculation}>{value}</Pad>
                );
            case "object":
                return (
                    <Pad lastCalculation={lastCalculation}>
                        <h2 className={"text-lg text-shade-4 font-semibold"}><span
                            className={"text-shade-2"}>Calculation /</span> Branch
                            with a total cost of {value.totalCost} levels:</h2>
                        <div className={"overflow-x-auto"}>
                            <UISteps steps={value.steps}/>
                        </div>
                    </Pad>
                );
            default:
                return undefined;
        }
    });
}

function Pad({
    children,
    lastCalculation
}: {
    children?: JSX.Element[],
    lastCalculation: State<Branch | string | undefined>
}) {
    return (
        <div className={"relative border border-shade-2 p-4 rounded-xl mb-8 max-w-full"}>
            {children}
            <button
                className={"absolute right-0 top-0 m-2 hover:bg-shade-2 rounded-lg transition"}
                onclick={() => setState(lastCalculation, undefined)}
            >
                <svg_
                    _width="24"
                    _height="24"
                    _viewBox="0 0 24 24"
                >
                    <rect_
                        _width="24"
                        _height="24"
                        _class={"fill-none"}
                    />
                    <path_
                        _d="M6 6L18 18M18 6L6 18"
                        _class={"stroke-2 stroke-shade-3 fill-none"}
                        _stroke-linecap="round"
                        _stroke-linejoin="round"
                    />
                </svg_>
            </button>
        </div> as Node
    );
}

function UISteps({steps}: {steps: Step[]}) {
    return steps.map((step, i) => (
        <UIStep step={step} i={i}/>
    )) as Node[];
}

function UIStep({step, i}: {step: Step, i: number}) {
    return (
        <div className={"flex [&>*]:flex-shrink-0 gap-4 mt-10 p-4 bg-shade-1 border border-shade-2 rounded-xl overflow-x-auto"}>
            <div className={"flex flex-col items-start gap-2"}>
                <h3 className={"rounded-lg bg-shade-4 text-shade-0 text-lg px-2 py-1 font-semibold"}>Step #{i + 1}</h3>
                <div>Costs {step.cost} levels</div>
            </div>
            <UIItem item={step.target}/>
            <div className={"self-center text-4xl"}>+</div>
            <UIItem item={step.sacrifice}/>
            <div className={"self-center text-4xl"}>=</div>
            <UIItem item={step.result}/>
        </div>
    );
}

function UIItem({item}: {item: Item}) {
    return (
        <div className={"border border-shade-2 p-4 rounded-lg w-56"}>
            <h4 className={"font-semibold text-shade-4 flex gap-2 mb-2"}>
                <img
                    src={`/${item.kind.replaceAll(" ", "-").toLowerCase()}.png`}
                    width={32}
                    height={32}
                    alt=""
                    className="[image-rendering:pixelated]"
                />
                {item.kind}
            </h4>
            {Array.from(item.enchantments.values()).map(enchantment => (
                <div>
                    {enchantment.kind}
                    {enchantment.level > 1 ? ` ${roman[enchantment.level as keyof typeof roman]}` : ""}
                </div>
            ))}
        </div>
    );
}