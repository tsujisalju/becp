import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, hardhatVerify],
  solidity: {
    profiles: {
      default: {
        version: "0.8.34",
      },
      production: {
        version: "0.8.34",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
    },
  },
  verify: {
    blockscout: {
      enabled: true,
    },
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    opSepolia: {
      type: "http",
      chainType: "op",
      url: configVariable(
        "ALCHEMY_API_KEY",
        "https:/opt-sepolia.g.alchemy.com/v2/{variable}"
      ),
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
      chainId: 11155420,
    },
    opMainnet: {
      type: "http",
      chainType: "op",
      url: configVariable(
        "ALCHEMY_API_KEY",
        "https://opt-mainnet.g.alchemy.com/v2/{variable}",
      ),
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
      chainId: 10,
    },
  },
});
