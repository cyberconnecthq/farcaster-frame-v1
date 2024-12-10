import { createPublicClient, http } from "viem";
import { optimismSepolia } from "viem/chains";

export const client = createPublicClient({
  chain: optimismSepolia,
  transport: http(),
});
