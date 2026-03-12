import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { TenantServices } from './tenant.service';
import { CreateTenantDto } from './dto/add.tenant.dto';
import { UpdateTenantDto } from './dto/update.tenant.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';




@Controller('tenant')
export class TenantController {
  constructor(private readonly tenantServices: TenantServices) {}

  @Post('create-tenant')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() body: CreateTenantDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.tenantServices.CreateTenant(body, file);
  }

  @Get('get-all')
  // Auto Response Caching

  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(120)

  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async getAll(@Query() query: any) {
    return await this.tenantServices.GetTenant(query);
  }

  // Get Tenant By Id
  @Get(':id')
  @Post('create-tenant')
  @Roles('tenant_owner', 'super_admin')
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tenantServices.GetTenantById(id);
  }

  // Update Tenant
  @Patch('update/:id')
  @Post('create-tenant')
  @Roles('tenant_owner', 'super_admin')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTenantDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.tenantServices.UpdateTenant(id, body, file);
  }

  // Delete Tenant
  @Delete('delete/:id')
  @Post('create-tenant')
  @Roles('tenant_owner', 'super_admin')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tenantServices.DeleteTenant(id);
  }


@Get('search')
async search(@Query('q') q: string) {
  return this.tenantServices.search(q);
}


}
