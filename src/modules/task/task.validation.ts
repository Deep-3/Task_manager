import { z } from "zod";
import { TaskStatus } from "./task.type";
import { Task_MESSAGES } from "./task.constant";

export const createTaskSchema = z.object({
    title: z.string().min(1, Task_MESSAGES.Error.TASK_TITLE_REQUIRED).max(255, Task_MESSAGES.Error.TASK_TITLE_LENGTH),
    description: z.string().max(1000, Task_MESSAGES.Error.TASK_DESCRIPTION_LENGTH).nullable().optional(),
    status: z.nativeEnum(TaskStatus).optional().default(TaskStatus.TODO),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, Task_MESSAGES.Error.TASK_TITLE_REQUIRED).max(255, Task_MESSAGES.Error.TASK_TITLE_LENGTH),
    description: z.string().max(1000, Task_MESSAGES.Error.TASK_DESCRIPTION_LENGTH).nullable().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
});

export const deleteTasksSchema = z.object({
    ids: z
        .array(z.string().uuid(Task_MESSAGES.Error.TASK_INVALID_ID_FORMAT))
        .min(1, Task_MESSAGES.Error.TASK_IDS_REQUIRED)
        .max(50, Task_MESSAGES.Error.TASK_DELETE_LIMIT),
});

export const taskQuerySchema = z.object({
    page: z
        .string()
        .regex(/^\d+$/, Task_MESSAGES.Error.TASK_INVALID_PAGE_NUMBER)
        .transform(Number)
        .optional()
        .default(() => 1),
    limit: z
        .string()
        .regex(/^\d+$/, Task_MESSAGES.Error.TASK_INVALID_LIMIT_NUMBER)
        .transform(Number)
        .refine((val) => val >= 1 && val <= 100, Task_MESSAGES.Error.TASK_INVALID_LIMIT_NUMBER)
        .optional()
        .default(() => 10),
    search: z.string().max(255, Task_MESSAGES.Error.TASK_SEARCH_QUERY_LENGTH).optional().default(""),
});

export const taskParamsSchema = z.object({
    id: z.string().uuid(Task_MESSAGES.Error.TASK_INVALID_ID_FORMAT),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type DeleteTasksInput = z.infer<typeof deleteTasksSchema>;
export type TaskQueryInput = z.infer<typeof taskQuerySchema>;
export type TaskParamsInput = z.infer<typeof taskParamsSchema>;
