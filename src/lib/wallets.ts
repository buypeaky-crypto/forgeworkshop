export const WALLETS = [
  {
    chain: "BTC",
    label: "Bitcoin",
    address: "G2dYPPTMorSSoUb68fKYbX55pARzrT1FcoRfjgYQFy9V",
  },
  {
    chain: "ETH",
    label: "Ethereum",
    address: "0x438E7Be244e46D414f097B211cC4fa7549fB3C3b",
  },
  {
    chain: "SOL",
    label: "Solana",
    address: "G2dYPPTMorSSoUb68fKYbX55pARzrT1FcoRfjgYQFy9V",
  },
] as const;

export type Wallet = (typeof WALLETS)[number];
