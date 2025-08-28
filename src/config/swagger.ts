import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Manager API",
            version: "1.0.0",
            description: "A comprehensive task management API with user authentication",
            contact: {
                name: "API Support",
                email: "support@taskmanager.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "token",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            description: "User unique identifier",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "User email address",
                        },
                        role: {
                            type: "string",
                            enum: ["user", "admin"],
                            description: "User role",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "User creation timestamp",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "User last update timestamp",
                        },
                    },
                },
                Task: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            format: "uuid",
                            description: "Task unique identifier",
                        },
                        title: {
                            type: "string",
                            description: "Task title",
                        },
                        description: {
                            type: "string",
                            nullable: true,
                            description: "Task description",
                        },
                        status: {
                            type: "string",
                            enum: ["todo", "in_progress", "done"],
                            description: "Task status",
                        },
                        ownerId: {
                            type: "string",
                            format: "uuid",
                            description: "Task owner ID",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Task creation timestamp",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Task last update timestamp",
                        },
                    },
                },
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Error message",
                        },
                        statusCode: {
                            type: "integer",
                            description: "HTTP status code",
                        },
                    },
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },
    apis: ["./dist/modules/*/*.controller.js"], // Path to the compiled API files
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(specs, {
            explorer: true,
            customCss: ".swagger-ui .topbar { display: none }",
            customSiteTitle: "Task Manager API Documentation",
        })
    );
};

export { specs };
