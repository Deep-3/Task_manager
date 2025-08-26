import { type Response } from "express";
import { HTTP_STATUS, APP_MESSAGES } from "../constants/http-constants";

export class ResponseHandler {
    static success<T>(res: Response, data: T, statusCode: number = HTTP_STATUS.OK) {
        return res.status(statusCode).json(data);
    }

    static created<T>(res: Response, data: T) {
        return res.status(HTTP_STATUS.CREATED).json(data);
    }

    static noContent(res: Response) {
        return res.status(HTTP_STATUS.NO_CONTENT).send();
    }

    static badRequest(res: Response, message: string = APP_MESSAGES.ERROR.BAD_REQUEST) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ statuscode: HTTP_STATUS.BAD_REQUEST, message });
    }

    static unauthorized(res: Response, message: string = APP_MESSAGES.ERROR.UNAUTHORIZED) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ statuscode: HTTP_STATUS.UNAUTHORIZED, message });
    }

    static forbidden(res: Response, message: string = APP_MESSAGES.ERROR.FORBIDDEN) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({ statuscode: HTTP_STATUS.FORBIDDEN, message });
    }

    static notFound(res: Response, message: string = APP_MESSAGES.ERROR.NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ statuscode: HTTP_STATUS.NOT_FOUND, message });
    }

    static internalError(res: Response, error?: Error | string) {
        const message =
            typeof error === "string" ? error : (error?.message ?? APP_MESSAGES.ERROR.INTERNAL_SERVER_ERROR);
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ statuscode: HTTP_STATUS.INTERNAL_SERVER_ERROR, message });
    }

    static handleError(res: Response, error: unknown) {
        const message = (error as Error)?.message ?? APP_MESSAGES.ERROR.INTERNAL_SERVER_ERROR;
        return res
            .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
            .json({ statuscode: HTTP_STATUS.INTERNAL_SERVER_ERROR, message });
    }
}
