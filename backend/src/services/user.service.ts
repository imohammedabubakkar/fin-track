import { User } from "../models/user.model.js";

export const listUsers = () => User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();

export async function saveUser(input: Record<string, unknown>) {
  const id = input.id;
  if (typeof id !== "string" || !id) throw new Error("A user id is required");
  const { id: _id, ...data } = input;
  return User.findOneAndUpdate(
    { externalId: id }, { ...data, externalId: id },
    { upsert: true, new: true, runValidators: true },
  ).select("-passwordHash").lean();
}
