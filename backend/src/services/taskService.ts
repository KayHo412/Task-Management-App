import prisma from "../db.js";

// Get all tasks for a specific owner
export async function getAllTasksByOwnerId(ownerId: string) {
  return await prisma.task.findMany({
    where: { ownerId },
    select: {
      id: true,
      title: true,
      body: true,
      done: true,
      priority: true,
      dueDate: true,
      order: true,
      teamId: true,
      createdAt: true,
    },
    orderBy: { order: 'asc' },
  });
}

// Create a new task
export async function createTask(
  ownerId: string,
  title: string,
  body?: string,
  priority?: string,
  dueDate?: string,
  teamId?: string,
) {
  return await prisma.task.create({
    data: {
      ownerId,
      title,
      body: body ?? null,
      priority: priority ?? 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      teamId: teamId ?? null,
      order: 0,
    },
    select: {
      id: true,
      title: true,
      body: true,
      done: true,
      priority: true,
      dueDate: true,
      order: true,
      teamId: true,
      createdAt: true,
    },
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
    select: {
      id: true,
      title: true,
      body: true,
      done: true,
      priority: true,
      dueDate: true,
      order: true,
      teamId: true,
      createdAt: true,
    },
  });
}

// Update task order (for drag and drop)
export async function updateTaskOrder(ownerId: string, taskId: string, order: number) {
  return await prisma.task.updateMany({
    where: { id: taskId, ownerId },
    data: { order },
  }).then(res => res.count ? findTaskById(ownerId, taskId) : null);
}

// Update task with new data
export async function updateTask(
  ownerId: string,
  taskId: string,
  data: {
    title?: string
    body?: string
    priority?: string
    dueDate?: string | null
    done?: boolean
  }
) {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.body !== undefined) updateData.body = data.body;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  if (data.done !== undefined) updateData.done = data.done;

  return await prisma.task.updateMany({
    where: { id: taskId, ownerId },
    data: updateData,
  }).then(res => res.count ? findTaskById(ownerId, taskId) : null);
}
