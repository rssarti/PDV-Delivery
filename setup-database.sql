-- Create tables for PDV system
CREATE TABLE "sales"
(
  "id" uuid NOT NULL,
  "items" jsonb NOT NULL,
  "total" numeric(10,2) NOT NULL,
  "paymentMethod" character varying NOT NULL,
  "customerId" uuid,
  "status" character varying NOT NULL,
  "cancelReason" text,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "cancelledAt" TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id")
);

CREATE TABLE "categories"
(
  "id" uuid NOT NULL,
  "name" character varying(255) NOT NULL,
  "description" text,
  "image" text,
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
);

CREATE TABLE "products"
(
  "id" uuid NOT NULL,
  "name" character varying(255) NOT NULL,
  "description" text,
  "price" numeric(10,2) NOT NULL,
  "stock" integer NOT NULL DEFAULT '0',
  "isActive" boolean NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  "categoryId" uuid,
  CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
);

ALTER TABLE "products" ADD CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" 
FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Create migrations table for TypeORM
CREATE TABLE "migrations"
(
  "id" SERIAL PRIMARY KEY,
  "timestamp" bigint NOT NULL,
  "name" character varying NOT NULL
);

-- Insert the migration record
INSERT INTO "migrations"
  ("timestamp", "name")
VALUES
  (1761399658448, 'CreateDatabase1761399658448');