import bcrypt from "bcryptjs";
import { signToken, type AuthUser } from "../middleware/auth.js";
import * as users from "../repositories/userRepository.js";
import { HttpError } from "../utils/httpError.js";

export async function login(email: string, password: string) {
  const user = await users.getUserByEmail(email);
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new HttpError(401, "Invalid email or password");
  }
  return issueSession(user);
}

export async function register(input: { name: string; email: string; password: string }) {
  const existing = await users.getUserByEmail(input.email);
  if (existing) {
    throw new HttpError(409, "An account with that email already exists");
  }
  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await users.createUser({
    email: input.email,
    name: input.name,
    passwordHash,
  });
  return issueSession(user);
}

export async function getProfile(userId: string) {
  const user = await users.getUserById(userId);
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  const { passwordHash, ...safe } = user;
  void passwordHash;
  return safe;
}

function issueSession(user: { id: string; email: string; name: string; role: string }) {
  const payload: AuthUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role === "admin" ? "admin" : "customer",
  };
  return {
    token: signToken(payload),
    user: payload,
  };
}
