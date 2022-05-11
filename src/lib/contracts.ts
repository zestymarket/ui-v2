export const USDC_ADDRESS: { [key: number]: string } = {
  4: `0xeb8f08a975Ab53E34D8a0330E0D34de942C95926`,
  137: `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174`,
};

export const USDC_ABI = [
  {
    inputs: [{ internalType: `address`, name: `account`, type: `address` }],
    name: `balanceOf`,
    outputs: [{ internalType: `uint256`, name: ``, type: `uint256` }],
    stateMutability: `view`,
    type: `function`,
  },
];
