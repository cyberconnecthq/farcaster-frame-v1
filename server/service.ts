import { config } from "dotenv";
config();
import { parseEther } from "viem";
import { randomBytes } from "crypto";

function generateRequestId(): string {
  return "0x" + randomBytes(32).toString("hex"); // Generates a 64-character hex string (32 bytes)
}

export async function getCalldata({
  nftAddress,
  tokenId,
  address,
  refer,
  selectedChain,
  price,
}: {
  nftAddress: string;
  tokenId: string;
  address: string;
  refer?: string;
  selectedChain: number;
  price: number;
}) {
  const vars = {
    input: {
      amount: 1,
      requestId: generateRequestId(),
      nft: nftAddress,
      tokenId: tokenId,
      to: address || "0x",
      price: parseEther(price.toString()).toString(),
      sourceChain: selectedChain,
      mintReferral: refer || "0x1F71D92A46Ab596ce22514A6f12C3D95cd51A30f", //it's our refer address
    },
  };
  console.log("🚀 ~ getCallData vars", vars);
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
  const req = new Request(process.env.NEXT_PUBLIC_IRO_API_GATE as string, {
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
  console.log("🚀 ~ getCalldata ~ data:", JSON.stringify(data));
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
    `${process.env.NEXT_PUBLIC_HERACLE_API_BASE}/contracts?contract_names=${name}`,
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
            }
            totalMintedAmount
            deadline
        }
      }
      `,
    variables: vars,
  });
  const req = new Request(process.env.NEXT_PUBLIC_IRO_API_GATE as string, {
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

  console.log(
    "🚀 ~ getNftInfo ~ data:",
    JSON.stringify(data.data.nft.metadata)
  );
  return data.data.nft.metadata;
}

export async function getCrossMintFee() {
  // console.log("🚀 ~ app.transaction ~ start");
  // const relayGateHookContractAddress = await getContactAddress({
  //   name: "contract_cyber_relay_gate_hook_yume",
  //   chainId: String(selectedChainId),
  // });
  // const readRes = (await client.readContract({
  //   address: relayGateHookContractAddress || "0x",
  //   abi: relayGateHookAbi,
  //   functionName: "mintFeeConfigs",
  //   args: [targetChainId],
  // })) as { data: any };
  // const crossMintFeeData = readRes.data;
  // console.log("🚀 ~ app.transaction ~ cross mint data", crossMintFeeData);

  // const crossMintFee =
  //   Array.isArray(crossMintFeeData) && crossMintFeeData.length > 2
  //     ? crossMintFeeData[2]
  //     : BigInt(0);
  // console.log("🚀 ~ app.transaction ~ cross mint fee", crossMintFee);

  // return crossMintFee;
  return 40000000000000n;
}
