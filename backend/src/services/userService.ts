import bcrypt from "bcrypt";
import prisma from "../db.js";

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    console.error(`Error finding user by email ${email}:`, error);
    throw new Error("Database error while finding user");
  }
}

/**
 * Create a new user with hashed password
 */
export async function createUser(email: string, password: string) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
      },
    });
  } catch (error) {
    console.error(`Error creating user ${email}:`, error);
    throw new Error("Database error while creating user");
  }
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Error finding user by id ${id}:`, error);
    throw new Error("Database error while finding user");
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUserById(id: string) {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw new Error("Database error while deleting user");
  }
}

/**
 * Update a user's password
 */
export async function updateUserPassword(id: string, newPassword: string) {
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    return await prisma.user.update({
      where: { id },
      data: { passwordHash: hash },
    });
  } catch (error) {
    console.error(`Error updating password for user ${id}:`, error);
    throw new Error("Database error while updating password");
  }
}

/**
 * Get all users (without passwords)
 */
export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw new Error("Database error while fetching users");
  }
}

/**
 * Validate user credentials (email + password)
 */
export async function validateUserCredentials(
  email: string,
  password: string
) {
  try {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return null;

    return user;
  } catch (error) {
    console.error(`Error validating credentials for ${email}:`, error);
    throw new Error("Database error while validating credentials");
  }
}
