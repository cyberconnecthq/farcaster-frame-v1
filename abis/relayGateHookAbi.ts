export const relayGateHookAbi = [
  {
    inputs: [{ internalType: "address", name: "_owner", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
      {
        indexed: false,
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "MintFeeConfigUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256", name: "chainId", type: "uint256" },
          { internalType: "bool", name: "enabled", type: "bool" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "fee", type: "uint256" },
        ],
        internalType: "struct YumeRelayHook.BatchConfigMintFeeParams[]",
        name: "params",
        type: "tuple[]",
      },
    ],
    name: "batchConfigMintFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "bool", name: "enabled", type: "bool" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "fee", type: "uint256" },
    ],
    name: "configMintFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "mintFeeConfigs",
    outputs: [
      { internalType: "bool", name: "enabled", type: "bool" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "fee", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "msgSender", type: "address" },
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "entryPoint", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "processRelay",
    outputs: [
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
          { internalType: "bytes", name: "callData", type: "bytes" },
        ],
        internalType: "struct RelayParams",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "rescueToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
