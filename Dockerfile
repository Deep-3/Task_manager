# Build stage
FROM node:22.18.0-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build:webpack

# Production stage
FROM node:22.18.0-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Copy deployment script
COPY --from=builder /app/deployment.sh .
RUN chmod +x /app/deployment.sh

# Start the application
CMD ["/app/deployment.sh"]