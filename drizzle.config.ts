import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema/index.ts',
    dialect: 'postgresql',
    dbCredentials: {
        // Session pooler (or direct connection) — transaction pooler doesn't support migrations reliably.
        url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
    },
});