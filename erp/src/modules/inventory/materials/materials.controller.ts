import {
  Controller,
  Body,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MaterialService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';

@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post('create-material')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateMaterialDto, @Req() req: any) {
    return this.materialService.AddMaterial(dto, req.user.tenantId);
  }

  @Get('get-all')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async getAll(@Query() query: any, @Req() req: any) {
    return this.materialService.GetMaterials(query, req.user.tenantId);
  }

  @Get(':id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async getById(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.materialService.GetMaterialById(id, req.user.tenantId);
  }

  @Patch('update/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateMaterialDto>,
    @Req() req: any,
  ) {
    return this.materialService.UpdateMaterial(id, dto, req.user.tenantId);
  }

  @Delete('delete/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.materialService.DeleteMaterial(id, req.user.tenantId);
  }
}
