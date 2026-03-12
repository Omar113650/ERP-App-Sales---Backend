// import all db to use in mcp
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Order } from 'src/modules/sales/order/entities/order.entities.js';
import { Tenant } from 'src/modules/tenant/entities/tenant.entities.js';
import { User } from 'src/modules/users/entities/user.entities.js';
import { Category } from 'src/modules/inventory/category/entities/category.entities.js';
import { Item } from 'src/modules/inventory/item/entities/item.entities.js';
import { Branch } from 'src/modules/branches/entities/branch.entities';
import { Material } from 'src/modules/inventory/materials/entities/materials.entities';
import { OrderItem } from 'src/modules/sales/order_item/entities/order_item.entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Omar2023',
  database: 'ERP',
entities: [Order, OrderItem, Tenant, User, Category, Item, Branch, Material],
  synchronize: true,
  logging: false,
});

