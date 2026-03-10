import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { optimism, optimismSepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
    appName: "BECP",
    projectId: "59256f3ae7358e9fed8ceda040399154",
    chains: [optimism, optimismSepolia],
  ssr: true,
  transports: {
    [optimism.id]: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [optimismSepolia.id]: http(`https:/opt-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  }
  })
