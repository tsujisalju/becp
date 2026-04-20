// Programmer Name  : Muhammad Qayyum Bin Mahamad Yazid, Software Engineering Degree Student, APU
// Program Name     : frontend/lib/db/index.ts
// Description      : Neon serverless + Drizzle ORM client. Uses the HTTP driver so it works
//                    correctly in Next.js serverless API routes without TCP connection pooling issues.
// First Written on : Tuesday, 21-Apr-2026
// Last Modified on : Tuesday, 21-Apr-2026

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
