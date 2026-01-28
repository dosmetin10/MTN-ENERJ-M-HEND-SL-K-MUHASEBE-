import { Pool, PoolClient } from "pg";

export type TxnFn<T> = (client: PoolClient) => Promise<T>;

export class TxnError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export function mapDbError(e: any): TxnError {
  const sqlState = e?.code || e?.sqlState;
  if (sqlState === "40P01") return new TxnError("TXN_DEADLOCK", "Deadlock");
  if (sqlState === "40001") return new TxnError("TXN_CONFLICT", "Serialization failure");
  if (sqlState === "P0001") return new TxnError("BUS_RULE_VIOLATION", e.message || "Rule violation");
  if (sqlState === "P0002") return new TxnError("NOT_FOUND", e.message || "Not found");
  return new TxnError("TXN_FAILED", e.message || "Transaction failed");
}

export async function withTransaction<T>(pool: any, fn: TxnFn<T>, maxRetry = 3): Promise<T> {
  let attempt = 0;
  while (true) {
    const client: PoolClient = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SET LOCAL application_name = 'MTN_ERP_V22'");
      await client.query("SET LOCAL app.context = 'FIS_TXN'");
      const result = await fn(client);
      await client.query("COMMIT");
      client.release();
      return result;
    } catch (err: any) {
      await client.query("ROLLBACK").catch(() => {});
      client.release();
      const mapped = mapDbError(err);
      if ((mapped.code === "TXN_DEADLOCK" || mapped.code === "TXN_CONFLICT") && attempt < maxRetry - 1) {
        attempt++;
        await new Promise(r => setTimeout(r, 50 * attempt * attempt));
        continue;
      }
      throw mapped;
    }
  }
}

// Examples:
// await withTransaction(pool, (c)=> createFis(c, payload));
// await withTransaction(pool, (c)=> cancelFis(c, fisId, reason));
// await withTransaction(pool, (c)=> reverseFis(c, fisId, reason));
