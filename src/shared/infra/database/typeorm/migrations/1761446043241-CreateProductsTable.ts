import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProductsTable1729300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Atualizar tabela de categorias para incluir parentCategoryId
    await queryRunner.query(`
      ALTER TABLE categories 
      ADD COLUMN IF NOT EXISTS parent_category_id UUID,
      ADD CONSTRAINT fk_categories_parent 
        FOREIGN KEY (parent_category_id) 
        REFERENCES categories(id)
    `);

    // Criar tabela suppliers
    await queryRunner.createTable(
      new Table({
        name: 'suppliers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '200',
          },
          {
            name: 'cnpj',
            type: 'varchar',
            length: '18',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      })
    );

    // Atualizar tabela products com novos campos
    await queryRunner.query(`
      ALTER TABLE products 
      DROP COLUMN IF EXISTS price,
      DROP COLUMN IF EXISTS stock,
      ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'PRODUTO_FINAL',
      ADD COLUMN IF NOT EXISTS base_unit VARCHAR(20) NOT NULL DEFAULT 'UN',
      ADD COLUMN IF NOT EXISTS base_quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
      ADD COLUMN IF NOT EXISTS fractional_unit VARCHAR(20),
      ADD COLUMN IF NOT EXISTS fractional_quantity DECIMAL(10,3),
      ADD COLUMN IF NOT EXISTS conversion_factor DECIMAL(10,6),
      ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS sale_price DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS suggested_price DECIMAL(10,2),
      ADD COLUMN IF NOT EXISTS profit_margin DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS promotional_price DECIMAL(10,2),
      ADD COLUMN IF NOT EXISTS promotional_price_start_date TIMESTAMP,
      ADD COLUMN IF NOT EXISTS promotional_price_end_date TIMESTAMP,
      ADD COLUMN IF NOT EXISTS ncm VARCHAR(20),
      ADD COLUMN IF NOT EXISTS cest VARCHAR(20),
      ADD COLUMN IF NOT EXISTS icms_rate DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS pis_rate DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS cofins_rate DECIMAL(5,2),
      ADD COLUMN IF NOT EXISTS origin VARCHAR(50) NOT NULL DEFAULT 'NACIONAL',
      ADD COLUMN IF NOT EXISTS availability_status VARCHAR(50) NOT NULL DEFAULT 'SEMPRE_DISPONIVEL',
      ADD COLUMN IF NOT EXISTS available_start_time VARCHAR(10),
      ADD COLUMN IF NOT EXISTS available_end_time VARCHAR(10),
      ADD COLUMN IF NOT EXISTS available_days TEXT,
      ADD COLUMN IF NOT EXISTS seasonal_start_date DATE,
      ADD COLUMN IF NOT EXISTS seasonal_end_date DATE,
      ADD COLUMN IF NOT EXISTS ean_code VARCHAR(50),
      ADD COLUMN IF NOT EXISTS internal_code VARCHAR(50),
      ADD COLUMN IF NOT EXISTS qr_code VARCHAR(255),
      ADD COLUMN IF NOT EXISTS images TEXT,
      ADD COLUMN IF NOT EXISTS preparation_time INTEGER,
      ADD COLUMN IF NOT EXISTS minimum_stock INTEGER,
      ADD COLUMN IF NOT EXISTS current_stock INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS stock_status VARCHAR(50) NOT NULL DEFAULT 'DISPONIVEL',
      ADD COLUMN IF NOT EXISTS expiration_date DATE,
      ADD COLUMN IF NOT EXISTS batch_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS can_be_ingredient BOOLEAN NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS needs_recipe BOOLEAN NOT NULL DEFAULT false
    `);

    // Criar tabela recipes
    await queryRunner.createTable(
      new Table({
        name: 'recipes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'product_id',
            type: 'uuid',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'preparation_time',
            type: 'integer',
          },
          {
            name: 'yield',
            type: 'decimal',
            precision: 10,
            scale: 3,
          },
          {
            name: 'yield_unit',
            type: 'varchar',
            length: '50',
          },
          {
            name: 'instructions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'total_cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: 'is_active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      })
    );

    // Criar tabela recipe_items
    await queryRunner.createTable(
      new Table({
        name: 'recipe_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'recipe_id',
            type: 'uuid',
          },
          {
            name: 'ingredient_product_id',
            type: 'uuid',
          },
          {
            name: 'quantity',
            type: 'decimal',
            precision: 10,
            scale: 3,
          },
          {
            name: 'unit',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'cost',
            type: 'decimal',
            precision: 10,
            scale: 2,
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['recipe_id'],
            referencedTableName: 'recipes',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['ingredient_product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      })
    );

    // Criar índices para melhor performance
    await queryRunner.query('CREATE INDEX idx_products_type ON products(type)');
    await queryRunner.query(
      'CREATE INDEX idx_products_category_id ON products(category_id)'
    );
    await queryRunner.query(
      'CREATE INDEX idx_products_internal_code ON products(internal_code)'
    );
    await queryRunner.query(
      'CREATE INDEX idx_products_ean_code ON products(ean_code)'
    );
    await queryRunner.query(
      'CREATE INDEX idx_products_stock_status ON products(stock_status)'
    );
    await queryRunner.query(
      'CREATE INDEX idx_products_is_active ON products(is_active)'
    );
    await queryRunner.query(
      'CREATE INDEX idx_suppliers_cnpj ON suppliers(cnpj)'
    );
    await queryRunner.query(
      'CREATE INDEX idx_suppliers_is_active ON suppliers(is_active)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recipe_items');
    await queryRunner.dropTable('recipes');
    await queryRunner.dropTable('suppliers');

    // Reverter alterações na tabela products
    await queryRunner.query(`
      ALTER TABLE products 
      DROP COLUMN IF EXISTS type,
      DROP COLUMN IF EXISTS base_unit,
      DROP COLUMN IF EXISTS base_quantity,
      DROP COLUMN IF EXISTS fractional_unit,
      DROP COLUMN IF EXISTS fractional_quantity,
      DROP COLUMN IF EXISTS conversion_factor,
      DROP COLUMN IF EXISTS cost_price,
      DROP COLUMN IF EXISTS sale_price,
      DROP COLUMN IF EXISTS suggested_price,
      DROP COLUMN IF EXISTS profit_margin,
      DROP COLUMN IF EXISTS promotional_price,
      DROP COLUMN IF EXISTS promotional_price_start_date,
      DROP COLUMN IF EXISTS promotional_price_end_date,
      DROP COLUMN IF EXISTS ncm,
      DROP COLUMN IF EXISTS cest,
      DROP COLUMN IF EXISTS icms_rate,
      DROP COLUMN IF EXISTS pis_rate,
      DROP COLUMN IF EXISTS cofins_rate,
      DROP COLUMN IF EXISTS origin,
      DROP COLUMN IF EXISTS availability_status,
      DROP COLUMN IF EXISTS available_start_time,
      DROP COLUMN IF EXISTS available_end_time,
      DROP COLUMN IF EXISTS available_days,
      DROP COLUMN IF EXISTS seasonal_start_date,
      DROP COLUMN IF EXISTS seasonal_end_date,
      DROP COLUMN IF EXISTS ean_code,
      DROP COLUMN IF EXISTS internal_code,
      DROP COLUMN IF EXISTS qr_code,
      DROP COLUMN IF EXISTS images,
      DROP COLUMN IF EXISTS preparation_time,
      DROP COLUMN IF EXISTS minimum_stock,
      DROP COLUMN IF EXISTS current_stock,
      DROP COLUMN IF EXISTS stock_status,
      DROP COLUMN IF EXISTS expiration_date,
      DROP COLUMN IF EXISTS batch_number,
      DROP COLUMN IF EXISTS can_be_ingredient,
      DROP COLUMN IF EXISTS needs_recipe,
      ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0
    `);

    // Reverter alterações na tabela categories
    await queryRunner.query(`
      ALTER TABLE categories 
      DROP CONSTRAINT IF EXISTS fk_categories_parent,
      DROP COLUMN IF EXISTS parent_category_id
    `);
  }
}
