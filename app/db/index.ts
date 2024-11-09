import { drizzle as drizzleLocal } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzleTurso } from "drizzle-orm/libsql";
import Database from "better-sqlite3";
import { migrate as migrateLocal } from "drizzle-orm/better-sqlite3/migrator";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { migrate as migrateTurso } from "drizzle-orm/libsql/migrator";

const isTurso = process.env.TURSO_CONNECTION_URL && process.env.TURSO_AUTH_TOKEN;

const db = isTurso ? drizzleTurso(createClient({
	url: process.env.TURSO_CONNECTION_URL!,
	authToken: process.env.TURSO_AUTH_TOKEN!,
}), { schema }) : drizzleLocal(new Database(process.env.DATABASE_PATH ?? "sqlite.db"), { schema });

const migrate = isTurso ? migrateTurso : migrateLocal;
// @ts-ignore source: trust me bro
migrate(db, { migrationsFolder: "./drizzle" });

export default db;

