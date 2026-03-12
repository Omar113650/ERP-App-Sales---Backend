import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';

export class ApiFeatures<T extends ObjectLiteral> {
  private alias: string;

  constructor(
    private query: SelectQueryBuilder<T>,
    private queryString: any,
  ) {
    this.alias = this.query.alias; // 👈 أهم تعديل
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'order'];
    excludedFields.forEach((el) => delete queryObj[el]);

    Object.keys(queryObj).forEach((key) => {
      const value = queryObj[key];

      if (typeof value === 'object') {
        Object.keys(value).forEach((operator) => {
          const paramKey = `${key}_${operator}`;

          switch (operator) {
            case 'gte':
              this.query.andWhere(
                `${this.alias}.${key} >= :${paramKey}`,
                { [paramKey]: value[operator] },
              );
              break;

            case 'gt':
              this.query.andWhere(
                `${this.alias}.${key} > :${paramKey}`,
                { [paramKey]: value[operator] },
              );
              break;

            case 'lte':
              this.query.andWhere(
                `${this.alias}.${key} <= :${paramKey}`,
                { [paramKey]: value[operator] },
              );
              break;

            case 'lt':
              this.query.andWhere(
                `${this.alias}.${key} < :${paramKey}`,
                { [paramKey]: value[operator] },
              );
              break;
          }
        });
      } else {
        this.query.andWhere(
          `${this.alias}.${key} ILIKE :${key}`, // 👈 استخدمت ILIKE علشان PostgreSQL
          { [key]: `%${value}%` },
        );
      }
    });

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const order =
        this.queryString.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      this.query.orderBy(
        `${this.alias}.${this.queryString.sort}`,
        order,
      );
    } else {
      // 👈 ده اللي كان مسبب المشكلة
      this.query.orderBy(`${this.alias}.createdAt`, 'DESC');
    }

    return this;
  }

  paginate() {
    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(this.queryString.limit) || 10, 1),
      100,
    );
    const skip = (page - 1) * limit;

    this.query.skip(skip).take(limit);

    return this;
  }

  async execute() {
    const [data, total] = await this.query.getManyAndCount();

    const page = Math.max(Number(this.queryString.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(this.queryString.limit) || 10, 1),
      100,
    );

    return {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalCount: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
      data,
    };
  }
}