import request from "supertest";
import app from "../server.js";
import prisma from "./prisma.service.js";

describe("Test user routes", () => {
  const user = {
    email: "test@example.com",
    password: "qwerty",
    name: "testUser",
  };

  it("Should not get info without JWT", async () => {
    const res = await request(app).get("/api/user/info");
    expect(res.statusCode).toEqual(401);
  });
  it("Should register new user", async () => {
    await prisma.user.delete({ where: { email: user.email } });
    const res = await request(app).post("/api/user/register").send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("user");
  });
  let jwt;
  it("Should login just registered user", async () => {
    const res = await request(app)
      .post("/api/user/login")
      .send({ email: user.email, password: user.password });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
    jwt = res.body.token;
  });
  it("Should get info with JWT", async () => {
    const res = await request(app)
      .get("/api/user/info")
      .set("Authorization", `Bearer ${jwt}`);
    expect(res.statusCode).toEqual(200);
  });
});
