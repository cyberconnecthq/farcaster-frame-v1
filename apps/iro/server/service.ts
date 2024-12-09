import { parseEther } from "viem";
import { randomBytes } from "crypto";
import { client } from "./client.js";
import { relayGateHookAbi } from "../abis/relayGateHookAbi.js";

function generateRequestId(): string {
  return "0x" + randomBytes(32).toString("hex"); // Generates a 64-character hex string (32 bytes)
}

export async function getCalldata({
  nftAddress,
  tokenId,
  address,
  refer,
  selectedChain,
}: {
  nftAddress: string;
  tokenId: string;
  address: string;
  refer: string;
  selectedChain: number;
}) {
  const vars = {
    input: {
      amount: 1,
      requestId: generateRequestId(),
      nft: nftAddress,
      tokenId: tokenId,
      to: address || "0x",
      price: parseEther((0.0002 * Number(1)).toString()).toString(),
      sourceChain: selectedChain,
      mintReferral: refer || "0x1F71D92A46Ab596ce22514A6f12C3D95cd51A30f", //it's our refer address
    },
  };
  const body = JSON.stringify({
    query: `
      mutation MintNftCalldata($input:MintNftCalldataInput!) {
          MintNftCalldata(input: $input) {
              status
              message
              data {
                requestId
                data
              }
          }
      }
      `,
    variables: vars,
  });
  const req = new Request("https://api.stg.cyberconnect.dev/yume/", {
    method: "POST",
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      Accept: "application/json",
      Connection: "keep-alive",
    },
    body: body,
  });
  const res = await fetch(req);
  const data = await res.json();
  console.log("🚀 ~ getCalldata ~ data:", data);
  return data.data.MintNftCalldata.data;
}

export async function getContactAddress({
  name,
  chainId,
}: {
  name: string;
  chainId: string;
}) {
  const req = new Request(
    `https://api.stg.cyberconnect.dev/heracles/contracts?contract_names=${name}`,
    {
      method: "GET",
      headers: {
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",
        Accept: "application/json",
        Connection: "keep-alive",
      },
    }
  );

  const res = await fetch(req);
  const { data } = await res.json();
  return data?.list?.[0]?.chain_map?.[chainId]?.address;
}

export async function getNftInfo({ id }: { id: string }) {
  const vars = {
    id,
  };
  const body = JSON.stringify({
    query: `
      query nft($id: ID!) {
        nft(id: $id) {
          status
          nft {
            nftId
            metadata {
              name
              description
              image
              tokenId
              chainId
              contract
              ethPrice
              usdPrice
              creator {
                displayName {
                  displayName
                }
                avatar
                formattedAddress
              }
            }
            totalMintedAmount
            deadline
          }
        }
      }
      `,
    variables: vars,
  });
  const req = new Request("https://api.stg.cyberconnect.dev/yume/", {
    method: "POST",
    headers: {
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      Accept: "application/json",
      Connection: "keep-alive",
    },
    body: body,
  });
  const res = await fetch(req);
  const data = await res.json();

  return data.data.nft.nft.metadata;
}

export async function getCrossMintFee({
  selectedChainId,
  targetChainId,
}: {
  selectedChainId: number;
  targetChainId: number;
}) {
  // const relayGateHookContractAddress = await getContactAddress({
  //   name: "contract_cyber_relay_gate_hook_yume",
  //   chainid: String(selectedChainId),
  // });

  // const readRes = (await client.readContract({
  //   address: relayGateHookContractAddress || "0x",
  //   abi: relayGateHookAbi,
  //   functionName: "mintFeeConfigs",
  //   args: [String(targetChainId)],
  // })) as { data: any };
  // const crossMintFeeData = readRes.data;
  // console.log("🚀 ~ app.transaction ~ cross mint data", crossMintFeeData);

  // const crossMintFee =
  //   Array.isArray(crossMintFeeData) && crossMintFeeData.length > 2
  //     ? crossMintFeeData[2]
  //     : BigInt(0);
  // console.log("🚀 ~ app.transaction ~ cross mint fee", crossMintFee);

  return 100000000000000n;
}
