import { type Response, Router } from "express";
import { type AuthRequest } from "../../middleware/auth";
import { TaskServices } from "./task.service";
import { Task } from "./task.model";
import { ResponseHandler } from "../../utils/response-handler";
import { Task_MESSAGES } from "./task.constant";
import { TaskStatus, UpdateTaskDTO } from "./task.type";
import { HTTP_STATUS } from "../../constants/http-constants";
import { validateBody, validateQuery, validateParams } from "../../middleware/validation";
import {
    createTaskSchema,
    updateTaskSchema,
    deleteTasksSchema,
    taskQuerySchema,
    taskParamsSchema,
    type CreateTaskInput,
    type UpdateTaskInput,
    type DeleteTasksInput,
    type TaskQueryInput,
    type TaskParamsInput,
} from "./task.validation";
const taskService = new TaskServices(Task);

export const tasksController: ReturnType<typeof Router> = Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 example: Write comprehensive API documentation
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *                 example: todo
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     created:
 *                       $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 */
tasksController.post("/", validateBody(createTaskSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status } = req.body as CreateTaskInput;
        const task = await taskService.getByTask(title, req.user!.id);
        if (task) return ResponseHandler.badRequest(res, Task_MESSAGES.Error.TASK_ALREDY_EXISTS);
        const created = await taskService.create({
            title,
            description: description ?? null,
            status: status ?? TaskStatus.TODO,
            ownerId: req.user!.id,
        });
        return ResponseHandler.created(res, { statuscode: HTTP_STATUS.CREATED, data: { created } });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get tasks with pagination and search
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Number of tasks per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query for task title or description
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 */
tasksController.get("/", validateQuery(taskQuerySchema), async (req: AuthRequest, res: Response) => {
    try {
        const { page, limit, search } = req.query as unknown as TaskQueryInput;

        const tasks =
            req.user!.role === "admin"
                ? await taskService.listAll(page, limit, search)
                : await taskService.listByOwner(req.user!.id, page, limit, search);
        return ResponseHandler.success(res, {
            statuscode: HTTP_STATUS.OK,
            count: tasks.rows.length,
            page: tasks.page,
            data: tasks.rows,
        });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not task owner
 *       404:
 *         description: Task not found
 */
tasksController.get("/:id", validateParams(taskParamsSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params as TaskParamsInput;
        const task = await taskService.getById(id);
        if (!task) return ResponseHandler.notFound(res, Task_MESSAGES.Error.TASK_NOT_FOUND);
        if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) return ResponseHandler.forbidden(res);
        return ResponseHandler.success(res, { statuscode: HTTP_STATUS.OK, data: { task } });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated task title
 *               description:
 *                 type: string
 *                 example: Updated task description
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *                 example: in_progress
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     task:
 *                       $ref: '#/components/schemas/Task'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not task owner
 *       404:
 *         description: Task not found
 */
tasksController.put(
    "/:id",
    validateParams(taskParamsSchema),
    validateBody(updateTaskSchema),
    async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params as TaskParamsInput;
            const updateData = req.body as UpdateTaskInput;

            const current = await taskService.getById(id);
            if (!current) return ResponseHandler.notFound(res, Task_MESSAGES.Error.TASK_NOT_FOUND);
            if (req.user!.role !== "admin" && current.ownerId !== req.user!.id) return ResponseHandler.forbidden(res);
            const updated = await taskService.update(id, updateData as UpdateTaskDTO);
            return ResponseHandler.success(res, { statuscode: HTTP_STATUS.OK, data: { task: updated } });
        } catch (error) {
            return ResponseHandler.handleError(res, error);
        }
    }
);

/**
 * @swagger
 * /tasks:
 *   delete:
 *     summary: Delete multiple tasks
 *     tags: [Tasks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["123e4567-e89b-12d3-a456-426614174000", "123e4567-e89b-12d3-a456-426614174001"]
 *     responses:
 *       200:
 *         description: Tasks deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedCount:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Bad request - IDs required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not task owner
 *       404:
 *         description: Task not found
 */
tasksController.delete("/", validateBody(deleteTasksSchema), async (req: AuthRequest, res: Response) => {
    try {
        const { ids } = req.body as DeleteTasksInput;

        // Check permissions for each task
        for (const id of ids) {
            const task = await taskService.getById(id);
            if (!task) return ResponseHandler.notFound(res, Task_MESSAGES.Error.TASK_NOT_FOUND);
            if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) {
                return ResponseHandler.forbidden(res);
            }
        }

        await taskService.delete(ids);
        return ResponseHandler.success(res, { statuscode: HTTP_STATUS.OK, data: { deletedCount: ids.length } });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});
