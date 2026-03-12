import { PartialType } from '@nestjs/swagger';
import { CreateBranchDto } from './add-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {}
