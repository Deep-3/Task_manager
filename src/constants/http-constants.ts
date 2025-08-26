// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

export const APP_MESSAGES = {
    INFO: {
        Login_Successfull: "Login successfull",
    },
    ERROR: {
        BAD_REQUEST: "Bad request",
        UNAUTHORIZED: "Unauthorized",
        FORBIDDEN: "Forbidden",
        NOT_FOUND: "Not found",
        INTERNAL_SERVER_ERROR: "Internal server error",
        TOKEN_REQUIRED: "Token is required",
        INVALID_TOKEN: "Invalid token",
        ACCESS_DENIED: "Access denied",
    },
};
