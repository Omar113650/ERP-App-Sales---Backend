import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Material } from './entities/materials.entities';
import { CreateMaterialDto } from './dto/create-material.dto';
import { Item } from '../item/entities/item.entities';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,

    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async AddMaterial(dto: CreateMaterialDto, tenantId: string) {
    const item = await this.itemRepository.findOne({
      where: { id: dto.itemId, tenant: { id: tenantId } },
    });
    if (!item) throw new NotFoundException('Item not found for this tenant');

    // منع duplicates حسب الاسم لنفس الـ item
    const existing = await this.materialRepository.findOne({
      where: { name: dto.name, item: { id: dto.itemId } },
      relations: ['item'],
    });
    if (existing)
      throw new ConflictException('Material already exists for this item');

    const material = this.materialRepository.create({
      ...dto,
      item,
    });

    return this.materialRepository.save(material);
  }

  async GetMaterials(queryParams: any, tenantId: string) {
    const query = this.materialRepository
      .createQueryBuilder('material')
      .leftJoinAndSelect('material.item', 'item')
      .where('item.tenant_id = :tenantId', { tenantId });

    // لو عندك ApiFeatures زي في Item
    // const features = new ApiFeatures(query, queryParams).filter().sort().paginate();
    // return features.execute();

    return query.getMany();
  }

  async GetMaterialById(id: string, tenantId: string) {
    const material = await this.materialRepository.findOne({
      where: { id, item: { tenant: { id: tenantId } } },
      relations: ['item'],
    });
    if (!material)
      throw new NotFoundException('Material not found for this tenant');
    return material;
  }

  async UpdateMaterial(
    id: string,
    dto: Partial<CreateMaterialDto>,
    tenantId: string,
  ) {
    const material = await this.materialRepository.preload({ id, ...dto });
    if (!material || material.item.tenant.id !== tenantId)
      throw new NotFoundException('Material not found for this tenant');

    if (dto.itemId) {
      const item = await this.itemRepository.findOne({
        where: { id: dto.itemId, tenant: { id: tenantId } },
      });
      if (!item) throw new NotFoundException('Item not found for this tenant');
      material.item = item;
    }

    return this.materialRepository.save(material);
  }

  async DeleteMaterial(id: string, tenantId: string) {
    const material = await this.GetMaterialById(id, tenantId);
    await this.materialRepository.remove(material);
    return { message: 'Material deleted successfully' };
  }
}
