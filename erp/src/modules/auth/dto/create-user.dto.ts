import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
  IsEnum,
  IsBoolean,
  IsUUID,
} from '@nestjs/class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../core/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Omar Elhelaly' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'omar@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(120)
  email: string;

  @ApiProperty({ example: 'Omar@669696' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/, {
    message: 'Password must contain uppercase, lowercase, number and symbol',
  })
  password: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Is account active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  // @ApiPropertyOptional({
  //   description: 'Tenant ID',
  //   example: 'uuid-of-tenant',
  // })

  // @IsOptional()
  // @IsUUID()
  // tenantId: string;

//   @ApiPropertyOptional({
//     description: 'Branch ID',
//     example: 'uuid-of-branch',
//   })
//   @IsOptional()
//   @IsUUID()
//   branchId: string;
  
  // @IsOptional()
  // @IsUUID()
  // tenantId?: string;

  // @IsOptional()
  // @IsUUID()
  // branchId?: string;
}
