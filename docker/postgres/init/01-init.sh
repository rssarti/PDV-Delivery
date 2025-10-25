#!/bin/bash
set -e

# Create additional databases or run initial scripts here
echo "🗄️  Initializing PDV Database..."

# Example: Create additional schemas
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create extensions if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Create schemas
    CREATE SCHEMA IF NOT EXISTS sales;
    CREATE SCHEMA IF NOT EXISTS products;
    CREATE SCHEMA IF NOT EXISTS customers;
    
    -- Grant permissions
    GRANT ALL PRIVILEGES ON SCHEMA sales TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON SCHEMA products TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON SCHEMA customers TO $POSTGRES_USER;
EOSQL

echo "✅ Database initialization completed!"