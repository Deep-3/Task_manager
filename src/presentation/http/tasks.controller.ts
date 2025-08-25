import { type Response, Router } from "express";
import { type AuthRequest } from "../../middleware/auth.js";
import { CreateTaskUseCase } from "../../application/task/CreateTask.js";
import { ListTasksUseCase } from "../../application/task/ListTasks.js";
import { GetTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase } from "../../application/task/GetUpdateDeleteTask.js";
import { SequelizeTaskRepository } from "../../infrastructure/repositories/SequelizeTaskRepository.js";

const repo = new SequelizeTaskRepository();
const createUC = new CreateTaskUseCase(repo);
const listUC = new ListTasksUseCase(repo);
const getUC = new GetTaskUseCase(repo);
const updateUC = new UpdateTaskUseCase(repo);
const deleteUC = new DeleteTaskUseCase(repo);

export const tasksController: ReturnType<typeof Router> = Router();

tasksController.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const { title, description, status } = req.body as { title?: string; description?: string | null; status?: "todo" | "in_progress" | "done" };
        if (!title) return res.status(400).json({ message: "title is required" });
        const task = await createUC.execute({ id: `tsk_${Math.random().toString(36).slice(2, 10)}${Date.now()}`, title, description: description ?? null, status: status ?? "todo", ownerId: req.user!.id });
        return res.status(201).json({ task });
    } catch (error) {
        const message = (error as Error)?.message ?? "Internal server error";
        return res.status(500).json({ message });
    }
});

tasksController.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const tasks = req.user!.role === "admin" ? await listUC.all() : await listUC.forOwner(req.user!.id);
        return res.json({ tasks });
    } catch (error) {
        const message = (error as Error)?.message ?? "Internal server error";
        return res.status(500).json({ message });
    }
});

tasksController.get("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const task = await getUC.byId(req.params.id as string);
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (req.user!.role !== "admin" && task.ownerId !== req.user!.id) return res.status(403).json({ message: "Forbidden" });
        return res.json({ task });
    } catch (error) {
        const message = (error as Error)?.message ?? "Internal server error";
        return res.status(500).json({ message });
    }
});

tasksController.put("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const current = await getUC.byId(req.params.id as string);
        if (!current) return res.status(404).json({ message: "Task not found" });
        if (req.user!.role !== "admin" && current.ownerId !== req.user!.id) return res.status(403).json({ message: "Forbidden" });
        const updated = await updateUC.execute(req.params.id as string, req.body as any);
        return res.json({ task: updated });
    } catch (error) {
        const message = (error as Error)?.message ?? "Internal server error";
        return res.status(500).json({ message });
    }
});

tasksController.delete("/:id", async (req: AuthRequest, res: Response) => {
    try {
        const current = await getUC.byId(req.params.id as string);
        if (!current) return res.status(404).json({ message: "Task not found" });
        if (req.user!.role !== "admin" && current.ownerId !== req.user!.id) return res.status(403).json({ message: "Forbidden" });
        await deleteUC.execute(req.params.id as string);
        return res.status(204).send();
    } catch (error) {
        const message = (error as Error)?.message ?? "Internal server error";
        return res.status(500).json({ message });
    }
});


