import type { Config } from "drizzle-kit";


export default {
  schema: "./src/domain/schema.ts",
  out: "./drizzle",
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: 'wrangler.toml',
    dbName: "v4p-db"
  }
} satisfies Config;
