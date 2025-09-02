import { config } from 'dotenv';

config();

export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}

export function optionalEnv(key: string): string | undefined {
  return process.env[key];
}
