import * as schema from "./schema";

export { schema };

// postgres library crashes next build when DATABASE_URL is undefined.
// Pages should check `process.env.DATABASE_URL` for the DB branch,
// not `db` truthiness, because `db` is a proxy (always truthy).

const url = process.env.DATABASE_URL;

// At build time, url is always undefined, so db is always null.
// At runtime with DATABASE_URL set, the proxy lazily initializes.
let _realDb: any = null;
let _loaded = false;

async function loadDb() {
  if (_loaded) return _realDb;
  _loaded = true;
  if (!url) return null;
  try {
    const postgresMod = await import("postgres");
    const postgres = postgresMod.default ?? postgresMod;
    const drizzleMod = await import("drizzle-orm/postgres-js");
    _realDb = drizzleMod.drizzle(postgres(url, { prepare: false }), { schema });
  } catch {
    _realDb = null;
  }
  return _realDb;
}

// Sync proxy — always starts as null-looking (no DB).
// Pages use `process.env.DATABASE_URL` to decide mock vs real.
export const db: any = null;

// Async getter for server components that want real DB
export { loadDb as getDb };
