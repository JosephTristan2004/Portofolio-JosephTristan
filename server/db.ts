import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const dataDirectory = resolve(root, process.env.DATA_DIR || "data");
mkdirSync(dataDirectory, { recursive: true });
// SQLite ini milik salinan kode yang kamu jalankan, terpisah dari website sebelumnya.
const database = new DatabaseSync(resolve(dataDirectory, "community.sqlite"));
database.exec("PRAGMA journal_mode = WAL;");
database.exec("PRAGMA busy_timeout = 3000;");
database.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
// Prepared statements menjaga nilai dari pengguna terpisah dari perintah SQL.
export function getRawDb() {
    return {
        prepare(sql: string) {
            let values: SQLInputValue[] = [];
            return {
                bind(...args: SQLInputValue[]) { values = args; return this; },
                async first<T = Record<string, unknown>>() {
                    return (database.prepare(sql).get(...values) as T | undefined) ?? null;
                },
                async all() {
                    return { results: database.prepare(sql).all(...values) };
                },
                async run() {
                    const result = database.prepare(sql).run(...values);
                    return { meta: { changes: Number(result.changes) } };
                },
            };
        },
    };
}
export function closeDatabase() { database.close(); }
