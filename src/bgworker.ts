import {generateBranches, Item} from "./data/anvil";

onmessage = (message: MessageEvent<Item[]>) =>
    postMessage(generateBranches(message.data));