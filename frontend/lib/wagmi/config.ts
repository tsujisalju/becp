import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { optimismSepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "BECP",
  projectId: "59256f3ae7358e9fed8ceda040399154",
  chains: [optimismSepolia],
  ssr: true,
  transports: {
    [optimismSepolia.id]: http("/api/rpc/optimism-sepolia"),
  },
});
