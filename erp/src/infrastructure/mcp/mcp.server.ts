import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { AppDataSource } from './data-source/data-source';
import { Tenant } from '../../modules/tenant/entities/tenant.entities';
import { Branch } from '../../modules/branches/entities/branch.entities';
import { Item } from '../../modules/inventory/item/entities/item.entities';
import { Material } from '../../modules/inventory/materials/entities/materials.entities';
import { Category } from '../../modules/inventory/category/entities/category.entities';
import { Order } from '../../modules/sales/order/entities/order.entities';
import { OrderItem } from '../../modules/sales/order_item/entities/order_item.entities';

// تهيئة الداتابيز مرة واحدة
async function initializeDB() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log('Database connected for MCP ERP server');
  }
}

// إنشاء MCP Server
const server = new McpServer({
  name: 'erp-app',
  version: '1.0.0',
});

/** Tool: المؤسسات والفروع */
server.registerTool(
  'get_tenants_branches',
  {
    description: 'جلب جميع المؤسسات والفروع التابعة لها',
    inputSchema: z.any(),
  },
  async () => {
    await initializeDB();
    const tenants = await AppDataSource.getRepository(Tenant)
      .createQueryBuilder('tenant')
      .leftJoinAndSelect('tenant.branches', 'branch')
      .getMany();

    const formatted = tenants.map((t) => ({
      tenant: t.name,
      branches: t.branches.map((b) => b.name),
    }));

    return {
      content: [{ type: 'text', text: JSON.stringify(formatted, null, 2) }],
    };
  },
);

/** Tool: أفضل 10 منتجات مبيعًا */
server.registerTool(
  'top_10_selling_items',
  {
    description: 'جلب أفضل 10 منتجات مبيعًا حسب عدد الطلبات',
    inputSchema: z.any(),
  },
  async () => {
    await initializeDB();
    const items = await AppDataSource.getRepository(Item)
      .createQueryBuilder('item')
      .leftJoin('item.orders', 'order')
      .leftJoin('order.items', 'orderItem')
      .groupBy('item.id')
      .orderBy('SUM(orderItem.quantity)', 'DESC')
      .take(10)
      .select([
        'item.id',
        'item.name',
        'SUM(orderItem.quantity) as soldQuantity',
      ])
      .getRawMany();

    return {
      content: [{ type: 'text', text: JSON.stringify(items, null, 2) }],
    };
  },
);

/** Tool: الطلبات لكل فرع */
server.registerTool(
  'orders_by_branch',
  {
    description: 'جلب كل الطلبات لكل فرع',
    inputSchema: z.object({
      branchId: z.string().describe('معرف الفرع'),
    }),
  },
  async ({ branchId }) => {
    await initializeDB();
    const orders = await AppDataSource.getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.branch', 'branch')
      .leftJoinAndSelect('order.items', 'items')
      .where('branch.id = :branchId', { branchId })
      .getMany();

    return {
      content: [{ type: 'text', text: JSON.stringify(orders, null, 2) }],
    };
  },
);

/** Tool: استهلاك المواد لكل منتج */
server.registerTool(
  'materials_usage',
  {
    description: 'جلب استهلاك المواد لكل منتج',
    inputSchema: z.object({
      itemId: z.string().describe('معرف المنتج'),
    }),
  },
  async ({ itemId }) => {
    await initializeDB();
    const item = await AppDataSource.getRepository(Item)
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.materials', 'material')
      .where('item.id = :itemId', { itemId })
      .getOne();

    if (!item) return { content: [{ type: 'text', text: 'المنتج غير موجود' }] };

    const formatted = item.materials.map((m) => ({
      material: m.name,
      used: m.current_quantity,
      min: m.min_quantity,
    }));

    return {
      content: [{ type: 'text', text: JSON.stringify(formatted, null, 2) }],
    };
  },
);

/** ------------------ Tool: الأسئلة العامة ------------------ **/

// 1. عدد المنتجات في كل فئة
server.registerTool(
  'count_items_by_category',
  {
    description: 'إحصائية عدد المنتجات لكل فئة',
    inputSchema: z.any(),
  },
  async () => {
    await initializeDB();
    const categories = await AppDataSource.getRepository(Category)
      .createQueryBuilder('category')
      .leftJoin('category.items', 'item')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(item.id)', 'itemCount')
      .groupBy('category.id')
      .getRawMany();

    return {
      content: [{ type: 'text', text: JSON.stringify(categories, null, 2) }],
    };
  },
);

// 2. جلب تفاصيل كل OrderItem حسب الطلب
server.registerTool(
  'order_items_by_order',
  {
    description: 'جلب كل عناصر الطلب لأي order معين',
    inputSchema: z.object({ orderId: z.string() }),
  },
  async ({ orderId }) => {
    await initializeDB();
    const orderItems = await AppDataSource.getRepository(OrderItem)
      .createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.item', 'item')
      .leftJoinAndSelect('orderItem.order', 'order')
      .where('order.id = :orderId', { orderId })
      .getMany();

    return { content: [{ type: 'text', text: JSON.stringify(orderItems, null, 2) }] };
  },
);

// 3. قائمة الفروع وكم منتج عندهم
server.registerTool(
  'branches_items_count',
  {
    description: 'عدد المنتجات في كل فرع',
    inputSchema: z.any(),
  },
  async () => {
    await initializeDB();
    const branches = await AppDataSource.getRepository(Branch)
      .createQueryBuilder('branch')
      .leftJoin('branch.orders', 'order')
      .leftJoin('order.items', 'orderItem')
      .groupBy('branch.id')
      .select('branch.name', 'branchName')
      .addSelect('COUNT(DISTINCT orderItem.item_id)', 'productCount')
      .getRawMany();

    return { content: [{ type: 'text', text: JSON.stringify(branches, null, 2) }] };
  },
);

/** ------------------ Tool: المواد ------------------ **/

// 1. جميع المواد مع المخزون الحالي
server.registerTool(
  'all_materials',
  {
    description: 'جلب جميع المواد مع المخزون الحالي لكل مادة',
    inputSchema: z.any(),
  },
  async () => {
    await initializeDB();
    const materials = await AppDataSource.getRepository(Material)
      .createQueryBuilder('material')
      .leftJoinAndSelect('material.item', 'item')
      .select(['material.id', 'material.name', 'material.current_quantity', 'material.min_quantity', 'item.name as itemName'])
      .getRawMany();

    return {
      content: [{ type: 'text', text: JSON.stringify(materials, null, 2) }],
    };
  },
);

// 2. المواد التي مخزونها أقل من الحد الأدنى
server.registerTool(
  'low_stock_materials',
  {
    description: 'جلب المواد التي المخزون الحالي لها أقل من الحد الأدنى',
    inputSchema: z.any(),
  },
  async () => {
    await initializeDB();
    const materials = await AppDataSource.getRepository(Material)
      .createQueryBuilder('material')
      .leftJoinAndSelect('material.item', 'item')
      .where('material.current_quantity < material.min_quantity')
      .select(['material.id', 'material.name', 'material.current_quantity', 'material.min_quantity', 'item.name as itemName'])
      .getRawMany();

    return {
      content: [{ type: 'text', text: JSON.stringify(materials, null, 2) }],
    };
  },
);

// 3. المواد حسب منتج معين
server.registerTool(
  'materials_by_item',
  {
    description: 'جلب كل المواد الخاصة بمنتج معين',
    inputSchema: z.object({ itemId: z.string() }),
  },
  async ({ itemId }) => {
    await initializeDB();
    const materials = await AppDataSource.getRepository(Material)
      .createQueryBuilder('material')
      .leftJoinAndSelect('material.item', 'item')
      .where('item.id = :itemId', { itemId })
      .select(['material.id', 'material.name', 'material.current_quantity', 'material.min_quantity'])
      .getRawMany();

    return {
      content: [{ type: 'text', text: JSON.stringify(materials, null, 2) }],
    };
  },
);

// 4. المواد المنتهية أو قرب انتهاء صلاحيتها
server.registerTool(
  'expired_materials',
  {
    description: 'جلب المواد المنتهية صلاحيتها أو القريبة من الانتهاء',
    inputSchema: z.object({ daysAhead: z.number().default(30) }),
  },
  async ({ daysAhead }) => {
    await initializeDB();
    const today = new Date();
    const alertDate = new Date();
    alertDate.setDate(today.getDate() + daysAhead);

    const materials = await AppDataSource.getRepository(Material)
      .createQueryBuilder('material')
      .leftJoinAndSelect('material.item', 'item')
      .where('material.expiry_date <= :alertDate', { alertDate: alertDate.toISOString().split('T')[0] })
      .select(['material.id', 'material.name', 'material.expiry_date', 'item.name as itemName'])
      .getRawMany();

    return {
      content: [{ type: 'text', text: JSON.stringify(materials, null, 2) }],
    };
  },
);

// تشغيل الـ Server عبر stdio
const transport = new StdioServerTransport();
server.connect(transport);

console.error('[MCP] ERP Server connected and ready');