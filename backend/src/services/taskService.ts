import prisma from "../db.js";

// Get all tasks for a specific owner
export async function getAllTasksByOwnerId(ownerId: string) {
  return await prisma.task.findMany({
    where: { ownerId },
    select: { id: true, title: true, body: true, done: true },
  });
}

// Create a new task
export async function createTask(ownerId: string, title: string, body?: string) {
  return await prisma.task.create({
    data: {
      ownerId,
      title,
      body: body ?? null,
    },
    select: { id: true, title: true, body: true, done: true },
  });
}

// Delete a task by owner and task ID
export async function deleteTaskById(ownerId: string, taskId: string) {
  return await prisma.task.deleteMany({
    where: { id: taskId, ownerId },
  }).then(res => res.count ? { id: taskId } : null);
}

// Mark a task as done
export async function markTaskAsDone(ownerId: string, taskId: string) {
  return await prisma.task.updateMany({
    where: { id: taskId, ownerId },
    data: { done: true },
  }).then(res => res.count ? findTaskById(ownerId, taskId) : null);
}

// Mark a task as undone
export async function markTaskAsUndone(ownerId: string, taskId: string) {
  return await prisma.task.updateMany({
    where: { id: taskId, ownerId },
    data: { done: false },
  }).then(res => res.count ? findTaskById(ownerId, taskId) : null);
}

// Find a task by owner and task ID
export async function findTaskById(ownerId: string, taskId: string) {
  return await prisma.task.findFirst({
    where: { id: taskId, ownerId },
    select: { id: true, title: true, body: true, done: true },
  });
}
