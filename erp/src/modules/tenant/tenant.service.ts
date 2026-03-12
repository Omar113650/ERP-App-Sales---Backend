import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entities';
import { CreateTenantDto } from './dto/add.tenant.dto';
import { UpdateTenantDto } from './dto/update.tenant.dto';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service';
import { ApiFeatures } from '../../shared/utils/api-features';
import { Logger } from '@nestjs/common';
import { CacheService } from '../../infrastructure/cache/cache.service';
@Injectable()
export class TenantServices {
  private readonly logger = new Logger(TenantServices.name);
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly cacheService: CacheService,
  ) {}

  async CreateTenant(
    createTenantDto: CreateTenantDto,
    logo?: Express.Multer.File,
  ) {
    let logoUrl: string | undefined = undefined;

    if (logo) {
      const result = await this.cloudinaryService.uploadFile(logo);
      logoUrl = result.secure_url;
    }

    const addTenant = this.tenantRepository.create({
      ...createTenantDto,
      logo: logoUrl,
    });
    this.logger.log('Creating new tenant');

    await this.cacheService.clear();
    return await this.tenantRepository.save(addTenant);
  }

  async GetTenant(queryParams: any) {

    const cacheKey = this.cacheService.generateKey('tenants', queryParams);

    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }
    const query = this.tenantRepository.createQueryBuilder('tenant');

    const features = new ApiFeatures(query, queryParams)
      .filter()
      .sort()
      .paginate();

    const data = await features.execute();

    await this.cacheService.set(cacheKey, data, 120);

    return data;
  }

  async GetTenantById(id: string) {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${id} not found`);
    }

    return tenant;
  }

  async DeleteTenant(id: string) {
    const tenant = await this.GetTenantById(id);

    await this.tenantRepository.remove(tenant);

    await this.cacheService.clear();

    return {
      message: 'Tenant deleted successfully',
    };
  }

  async UpdateTenant(
    id: string,
    updateTenantDto: UpdateTenantDto,
    logo?: Express.Multer.File,
  ): Promise<Tenant> {
    const updateData: any = { ...updateTenantDto };

    if (logo) {
      const result = await this.cloudinaryService.uploadFile(logo);
      updateData.logo = result.secure_url;
    } else {
      delete updateData.logo;
    }

    const tenant = await this.tenantRepository.preload({
      id,
      ...updateData,
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return await this.tenantRepository.save(tenant);
  }

async search(query: string) {
    try {
      if (!query || query.trim() === '') {
        return [];
      }

      const result = await this.tenantRepository.query(
        `
        SELECT *, ts_rank(document_tsv, plainto_tsquery($1)) AS rank
        FROM tenants
        WHERE document_tsv @@ plainto_tsquery($1)
        ORDER BY rank DESC
        `,
        [query],
      );
 console.log(result)
      return result;
    } catch (error) {
      console.error('Tenant Search Error:', error);
     
      throw error;
    }
  }
}