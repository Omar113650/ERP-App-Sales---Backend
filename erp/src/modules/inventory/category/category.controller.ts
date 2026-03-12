import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create-category')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async create(@Body() body: CreateCategoryDto, @Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.categoryService.AddCategory(body, tenantId);
  }

  @Get('get-all')
  @Roles('tenant_owner', 'super_admin', 'cashier', 'branch_manage')
  @UseGuards(RolesGuard)
  async getAll(@Query() query: any) {
    return this.categoryService.GetCategory(query);
  }

  @Get('get/:id')
  @Roles('tenant_owner', 'super_admin', 'cashier', 'branch_manage')
  @UseGuards(RolesGuard)
  async getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.GetCategoryById(id);
  }

  @Patch('update/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body()
    body: CreateCategoryDto,
  ) {
    return this.categoryService.UpdateCategory(id, body);
  }

  @Delete('delete/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoryService.DeleteCategory(id);
  }
}
