import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entities';
import { CreateItemDto } from './dto/create-Item.dto';
import { Category } from '../category/entities/category.entities';
import { Tenant } from '../../tenant/entities/tenant.entities';
import { ApiFeatures } from '../../../shared/utils/api-features';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service';
@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async AddItem(
    dto: CreateItemDto,
    tenantId: string,
    image?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined = undefined;

    if (image) {
      const result = await this.cloudinaryService.uploadFile(image);
      imageUrl = result.secure_url;
    }
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');

    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId, tenant: { id: tenantId } },
    });
    if (!category)
      throw new NotFoundException('Category not found for this tenant');

    const existing = await this.itemRepository.findOne({
      where: { name: dto.name, tenant: { id: tenantId } },
      relations: ['tenant'],
    });
    if (existing)
      throw new ConflictException('Item already exists for this tenant');

    const item = this.itemRepository.create({
      ...dto,
      tenant,
      category,
      image: imageUrl,
    });

    return this.itemRepository.save(item);
  }

  async GetItems(queryParams: any, tenantId: string) {
    const query = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.tenant', 'tenant')
      .leftJoinAndSelect('item.category', 'category')
      .where('item.tenant_id = :tenantId', { tenantId });

    const features = new ApiFeatures(query, queryParams)
      .filter()
      .sort()
      .paginate();

    return features.execute();
  }

  async GetItemById(id: string, tenantId: string) {
    const item = await this.itemRepository.findOne({
      where: { id, tenant: { id: tenantId } },
      relations: ['tenant', 'category', 'materials'],
    });
    if (!item) throw new NotFoundException('Item not found for this tenant');
    return item;
  }

  async UpdateItem(id: string, dto: Partial<CreateItemDto>, tenantId: string) {
    const item = await this.itemRepository.preload({
      id,
      ...dto,
    });
    if (!item || item.tenant.id !== tenantId)
      throw new NotFoundException('Item not found for this tenant');

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId, tenant: { id: tenantId } },
      });
      if (!category)
        throw new NotFoundException('Category not found for this tenant');
      item.category = category;
    }

    return this.itemRepository.save(item);
  }

  async DeleteItem(id: string, tenantId: string) {
    const item = await this.GetItemById(id, tenantId);
    await this.itemRepository.remove(item);
    return { message: 'Item deleted successfully' };
  }
}
