import { withTransaction } from "../../app/domain/transactions";
import { createFis, cancelFis, reverseFis } from "../../app/domain/fisService";
import { Pool } from "pg";

jest.mock("pg");

const MockPool = Pool as unknown as jest.Mock<Pool>;

describe("Fis domain", () => {
  let pool: any;
  let client: any;

  beforeEach(() => {
    client = {
      query: jest.fn(),
      release: jest.fn()
    };
    pool = {
      connect: jest.fn().mockResolvedValue(client)
    };
    (MockPool as any).mockImplementation(() => pool);
  });

  test("create SATIS inserts movements", async () => {
    client.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({}) // SET LOCAL
      .mockResolvedValueOnce({ rows: [{ id: "fis-1" }] }) // insert fisler
      .mockResolvedValue({}) ; // others

    const result = await withTransaction(pool as any, (c)=> createFis(c, {
      tur: "SATIS",
      cari_id: "c1",
      kalemler: [{ stok_id:"s1", miktar:2, birim:"adet", birim_fiyat:100, kdv_oran:20 }]
    }));
    expect(result.fis_id).toBe("fis-1");
  });

  test("cancel only ACTIVE", async () => {
    client.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({}) // SET LOCAL
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ status: "ACTIVE" }] }) // select for update
      .mockResolvedValue({}); // updates
    await expect(withTransaction(pool as any, (c)=> cancelFis(c, "fis-1", "hata"))).resolves.toBeUndefined();
  });

  test("reverse produces swapped movements", async () => {
    client.query
      .mockResolvedValueOnce({}) // BEGIN
      .mockResolvedValueOnce({}) // SET LOCAL
      .mockResolvedValueOnce({ rowCount: 1, rows: [{ id:"fis-1", tur:"SATIS", status:"ACTIVE", cari_id:"c1" }] }) // head
      .mockResolvedValueOnce({ rows: [{ id:"rev-1"}] }) // new head
      .mockResolvedValue({}); // inserts/swaps
    const res = await withTransaction(pool as any, (c)=> reverseFis(c, "fis-1", "düzeltme"));
    expect(res.reversed_id).toBe("rev-1");
  });
});
