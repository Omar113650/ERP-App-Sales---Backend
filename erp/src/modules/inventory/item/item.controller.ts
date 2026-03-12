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
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-Item.dto';
import { Roles } from '../../../core/decorators/roles.decorator';
import { RolesGuard } from '../../../core/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('create-item')
  
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateItemDto,
    @Req() req: any,
  ) {
    return this.itemService.AddItem(dto, req.user.tenantId, file);
  }

  @Get('get-all')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async getAll(@Query() query: any, @Req() req: any) {
    return this.itemService.GetItems(query, req.user.tenantId);
  }

  @Get(':id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async getById(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.itemService.GetItemById(id, req.user.tenantId);
  }

  @Patch('update/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateItemDto,
    @Req() req: any,
  ) {
    return this.itemService.UpdateItem(id, dto, req.user.tenantId);
  }

  @Delete('delete/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.itemService.DeleteItem(id, req.user.tenantId);
  }
}
