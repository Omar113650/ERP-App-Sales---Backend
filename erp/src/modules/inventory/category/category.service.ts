import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Category } from './entities/category.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiFeatures } from '../../../shared/utils/api-features';
import { Tenant } from '../../tenant/entities/tenant.entities';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async AddCategory(createCategoryDto: CreateCategoryDto, tenantId: string) {
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const existing = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name, tenant: { id: tenantId } },
      relations: ['tenant'],
    });

    if (existing)
      throw new ConflictException('Category already exists for this tenant');

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      tenant,
    });

    return await this.categoryRepository.save(category);
  }

  async GetCategory(queryParams: any) {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.tenant', 'tenant');

    const feature = new ApiFeatures(query, queryParams)
      .filter()
      .sort()
      .paginate();

    return feature.execute();
  }

  async GetCategoryById(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['tenant', 'items'],
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async UpdateCategory(id: string, body: Partial<CreateCategoryDto>) {
    const category = await this.categoryRepository.preload({
      id,
      ...body,
    });

    if (!category) throw new NotFoundException('Category not found');

    return await this.categoryRepository.save(category);
  }

  async DeleteCategory(id: string) {
    const category = await this.GetCategoryById(id);
    await this.categoryRepository.remove(category);
    return { message: 'Category deleted successfully' };
  }
}
