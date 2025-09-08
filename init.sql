-- ./db/init.sql

-- Create user if not exists
DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = 'postgres'
    ) THEN
        CREATE ROLE postgres WITH LOGIN PASSWORD 'password';
    END IF;
END
$$;

-- Create database if not exists
DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'Task_Manage'
    ) THEN
        CREATE DATABASE "Task_Manage";
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE "Task_Manage" TO postgres;
