import request from "supertest";
import app from "../server.js";
import * as db from "./testSetup.js";
import User from "../models/User.js";

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.closeDatabase();
});

beforeEach(async () => {
  await db.clearDatabase();
});

describe("🔑 Authentication API Integration Tests", () => {
  const testUser = {
    name: "John Tester",
    email: "john.test@example.com",
    password: "securePassword123",
    role: "Student",
  };

  describe("POST /api/auth/register", () => {
    it("should successfully register a student user and return a token without password leaks", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("name", testUser.name);
      expect(res.body.user).toHaveProperty("email", testUser.email);
      expect(res.body.user).toHaveProperty("role", testUser.role);
      
      // CRITICAL: Ensure password is completely omitted in response
      expect(res.body.user).not.toHaveProperty("password");

      // Verify the user exists in database
      const dbUser = await User.findOne({ email: testUser.email });
      expect(dbUser).toBeTruthy();
    });

    it("should fail validation and return 400 when missing required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "123", // too short
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("status", "fail");
      expect(res.body).toHaveProperty("message", "Validation failed");
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: "name" })
      );
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: "email" })
      );
      expect(res.body.errors).toContainEqual(
        expect.objectContaining({ field: "password" })
      );
    });

    it("should reject and return 400 if a user already exists with the same email", async () => {
      // Register first user
      await request(app).post("/api/auth/register").send(testUser);

      // Register duplicate
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("status", "fail");
      expect(res.body.message).toMatch(/exists/i);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Pre-register user for login tests
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login successfully with valid credentials and return token without password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user).toHaveProperty("email", testUser.email);
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should reject and return 400 for incorrect password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "wrongpassword",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("status", "fail");
      expect(res.body.message).toMatch(/credentials/i);
    });

    it("should reject and return 400 for a non-existing email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexist@test.com",
          password: testUser.password,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("status", "fail");
      expect(res.body.message).toMatch(/credentials/i);
    });
  });

  describe("GET /api/auth/me", () => {
    it("should retrieve the profile of the current authenticated user without password", async () => {
      // Register and get token
      const regRes = await request(app).post("/api/auth/register").send(testUser);
      const token = regRes.body.token;

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.user).toHaveProperty("email", testUser.email);
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("should block request and return 401 if token is missing", async () => {
      const res = await request(app).get("/api/auth/me");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/token/i);
    });
  });
});
