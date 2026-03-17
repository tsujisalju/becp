"server only";

// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/lib/pinata/config.ts
// Description      : Pinata configuration file
// First Written on : Tuesday, 17-Mar-2026
// Last Modified on : Tuesday, 17-Mar-2026

import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
});
