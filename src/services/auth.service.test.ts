import { registerUser, loginUser, logoutUser } from "./auth.service";
import { createUser, findByEmail } from "../repositories/user.repository";
jest.mock("../repositories/user.repository");
const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;
const mockFindByEmail = findByEmail as jest.MockedFunction<typeof findByEmail>;
import bcrypt from "bcryptjs";
jest.mock("bcryptjs");
const mockHash = bcrypt.hash as jest.Mock;
const mockCompare = bcrypt.compare as jest.Mock;
import { signToken } from "../utils/jwt";
jest.mock("../utils/jwt");
const mockSignToken = signToken as jest.MockedFunction<typeof signToken>;
import redis from "../config/redis";
jest.mock("../config/redis");
const mockRedisSet = redis.set as jest.MockedFunction<typeof redis.set>;
import jwt from "jsonwebtoken";
jest.mock("jsonwebtoken");
const mockJwtDecode = jwt.decode as jest.MockedFunction<typeof jwt.decode>;
import { BadRequestError, UnauthorizedError } from "../utils/error";
import { RegisterInput } from "../validators/auth.validator";
import { Prisma, User } from "@prisma/client";

const registerUserDetail: RegisterInput = {
  name: "Adinova Indra Permana",
  email: "adinovaindra@barokah.com",
  password: "hashedPassword",
  role: "ADMIN",
};

const mockCreateUserData: User = {
  name: "Adinova Indra Permana",
  email: "adinovaindra@barokah.com",
  password: "hashedPassword",
  role: "ADMIN",
  id: 1,
  createdAt: new Date(),
};

const mockFindUserData: User = {
  name: "Adinova Indra Permana",
  email: "adinovaindra@barokah.com",
  password: "hashedPassword",
  role: "ADMIN",
  id: 1,
  createdAt: new Date(),
};

describe("Auth Service", () => {
  describe("registerUser", () => {
    it("should register user successfully", async () => {
      mockFindByEmail.mockResolvedValue(null);
      mockHash.mockResolvedValue("hashedPassword");
      mockCreateUser.mockResolvedValue(mockCreateUserData);

      const result = await registerUser(registerUserDetail);

      expect(result).not.toHaveProperty("password");
      expect(result).toHaveProperty("name", "Adinova Indra Permana");
      expect(result).toHaveProperty("role", "ADMIN");
    });

    it("should throw error when email already exist", async function () {
      mockFindByEmail.mockResolvedValue(mockFindUserData);

      const result = registerUser(registerUserDetail);

      await expect(result).rejects.toThrow(new BadRequestError("Email already registered!"));
    });

    it("should throw error due to race condition", async () => {
      mockFindByEmail.mockResolvedValue(null);
      mockHash.mockResolvedValue("hashedPassword");
      mockCreateUser.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
          code: "P2002",
          clientVersion: "5.22.0",
        }),
      );

      const result = registerUser(registerUserDetail);

      await expect(result).rejects.toThrow("Email already registered!");
    });
  });

  describe("loginUser", () => {
    it("should login user successfully", async () => {
      mockFindByEmail.mockResolvedValue(mockFindUserData);

      mockCompare.mockResolvedValue(true);
      mockSignToken.mockReturnValue("randomStringToken");

      const result = await loginUser({
        email: "adinovaindra@barokah.com",
        password: "hashedpassword",
      });

      expect(result).toHaveProperty("token");
    });

    it("should throw error when email not found", async () => {
      mockFindByEmail.mockResolvedValue(null);

      const result = loginUser({
        email: "adinovaindra@barokah.com",
        password: "hashedPassword",
      });

      await expect(result).rejects.toThrow(new UnauthorizedError("Email or password is invalid"));
    });

    it("should throw error due to incorrect password", async function () {
      mockFindByEmail.mockResolvedValue(mockFindUserData);

      mockCompare.mockResolvedValue(false);

      const result = loginUser({
        email: "adinovaindra@barokah.com",
        password: "hashedPassword",
      });

      await expect(result).rejects.toThrow(new UnauthorizedError("Email or password is invalid"));
    });
  });

  describe("logoutUser", () => {
    const token = "randomStringDecoded";

    it("should successfully logout", async () => {
      mockJwtDecode.mockReturnValue({
        exp: 999999,
      });

      await logoutUser(token);
      expect(mockRedisSet).toHaveBeenCalledWith(`blacklist:${token}`, "1", "EX", expect.any(Number));
    });

    it("should throw error due to decoded undefined", async () => {
      mockJwtDecode.mockReturnValue(null);
      const result = logoutUser(token);
      await expect(result).rejects.toThrow(new UnauthorizedError("Invalid Token!"));
    });

    it("should throw error due to typeof decoded is string", async () => {
      mockJwtDecode.mockReturnValue("string");
      const result = logoutUser(token);
      await expect(result).rejects.toThrow(new UnauthorizedError("Invalid Token!"));
    });

    it("should throw error due to decoded.exp is undefined", async () => {
      mockJwtDecode.mockReturnValue({
        userId: 1,
        role: "ADMIN",
      });

      const result = logoutUser(token);
      await expect(result).rejects.toThrow(new UnauthorizedError("Invalid Token!"));
    });
  });
});
