import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/add-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('create-branch')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async create(@Body() body: CreateBranchDto) {
    return await this.branchService.CreateBranch(body);
  }

  @Get('get-all')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async getAll(@Query() query: any) {
    return await this.branchService.GetBranches(query);
  }

  @Get('get/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async getById(@Param('id') id: string) {
    return await this.branchService.GetBranchById(id);
  }

  @Patch('update/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async update(@Param('id') id: string, @Body() body: UpdateBranchDto) {
    return await this.branchService.UpdateBranch(id, body);
  }

  @Delete('delete/:id')
  @Roles('tenant_owner', 'super_admin')
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string) {
    return await this.branchService.DeleteBranch(id);
  }
}
