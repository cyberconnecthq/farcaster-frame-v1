import { createPublicClient, http } from "viem";
import { base, optimismSepolia } from "viem/chains";
import { isPrd } from "../types.js";

const baseClient = createPublicClient({
  chain: base,
  transport: http(),
});

const opSepoliaClient = createPublicClient({
  chain: optimismSepolia,
  transport: http("https://api.zan.top/opt-sepolia"),
});

export const client = isPrd ? baseClient : opSepoliaClient;
