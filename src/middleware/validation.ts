import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ResponseHandler } from "../utils/response-handler";

export const validate = (schemas: { body?: z.ZodSchema; query?: z.ZodSchema; params?: z.ZodSchema }) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }

            if (schemas.query) {
                req.query = schemas.query.parse(req.query) as AnyType;
            }

            if (schemas.params) {
                req.params = schemas.params.parse(req.params) as AnyType;
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return ResponseHandler.badRequest(res, "Validation Failed");
            }

            return ResponseHandler.handleError(res, error);
        }
    };
};

export const validateBody = (schema: z.ZodSchema) => validate({ body: schema });
export const validateQuery = (schema: z.ZodSchema) => validate({ query: schema });
export const validateParams = (schema: z.ZodSchema) => validate({ params: schema });
