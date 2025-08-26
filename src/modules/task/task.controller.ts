import { type Response, Router } from "express";
import { type AuthRequest } from "../../middleware/auth";
import { TaskServices } from "./task.service";
import { Task } from "./task.model";
import { ResponseHandler } from "../../utils/response-handler";
import { Task_MESSAGES } from "./task.constant";
import { TaskStatus } from "./task-status";
import { HTTP_STATUS } from "../../constants/http-constants";
import { UpdateTaskDTO } from "./task.repository";
const taskService = new TaskServices(Task);

export const tasksController: ReturnType<typeof Router> = Router();

type bodyType = {
    title: string;
    description?: string | null;
    status?: TaskStatus;
};

tasksController.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status } = req.body as bodyType;
        if (!title) return ResponseHandler.badRequest(res, Task_MESSAGES.Error.TASK_TITLE_REQUIRED);
        const task = await taskService.create({
            id: `tsk_${Math.random().toString(36).slice(2, 10)}${Date.now()}`,
            title,
            description: description ?? null,
            status: status ?? TaskStatus.TODO,
            ownerId: req.user!.id,
        });
        return ResponseHandler.created(res, { statuscode: HTTP_STATUS.CREATED, data: { task } });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

tasksController.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const pageParam = req.query.page as string;
        const limitParam = req.query.limit as string;
        const searchQuery = req.query.search as string;
        const page = pageParam ? parseInt(pageParam, 10) : 1;
        const limit = limitParam ? parseInt(limitParam, 10) : 10;
        const search = searchQuery ? searchQuery : "";

        if (isNaN(page) || page < 1) {
            return ResponseHandler.badRequest(res, Task_MESSAGES.Error.TASK_INVALID_PAGE_NUMBER);
        }

        if (isNaN(limit) || limit < 1) {
            return ResponseHandler.badRequest(res, Task_MESSAGES.Error.TASK_INVALID_LIMIT_NUMBER);
        }

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

tasksController.get("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const task = await taskService.getById(req.params.id as string);
        if (!task) return ResponseHandler.notFound(res, Task_MESSAGES.Error.TASK_NOT_FOUND);
        if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) return ResponseHandler.forbidden(res);
        return ResponseHandler.success(res, { statuscode: HTTP_STATUS.OK, data: { task } });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

tasksController.put("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const current = await taskService.getById(req.params.id as string);
        if (!current) return ResponseHandler.notFound(res, Task_MESSAGES.Error.TASK_NOT_FOUND);
        if (req.user!.role !== "admin" && current.ownerId !== req.user!.id) return ResponseHandler.forbidden(res);
        const updated = await taskService.update(req.params.id as string, req.body as UpdateTaskDTO);
        return ResponseHandler.success(res, { statuscode: HTTP_STATUS.OK, data: { task: updated } });
    } catch (error) {
        return ResponseHandler.handleError(res, error);
    }
});

tasksController.delete("/", async (req: AuthRequest, res: Response) => {
    try {
        const { ids } = req.body as { ids: string[] };
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return ResponseHandler.badRequest(res, Task_MESSAGES.Error.TASK_IDS_REQUIRED);
        }

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
