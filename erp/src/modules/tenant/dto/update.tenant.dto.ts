import { PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './add.tenant.dto';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
