import request from "supertest";
import { app, appInit } from "../server.js";

describe("Test user routes", () => {
  it("Should not get info without JWT", async () => {
    await appInit();
    const res = await request(app).get("/api/user/info");
    expect(res.statusCode).toEqual(401);
  });
});
