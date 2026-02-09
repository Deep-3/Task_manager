#!/bin/sh
pnpm run migration:run
exec node dist/main