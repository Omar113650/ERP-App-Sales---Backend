import { PartialType } from '@nestjs/swagger';
import { CreateItemDto } from './create-Item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {}