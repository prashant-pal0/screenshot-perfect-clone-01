import { IsString, IsNotEmpty, IsOptional, MaxLength, IsArray, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMasterRoleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: [String], description: 'Array of permission keys' })
    @IsArray()
    @IsString({ each: true })
    permissions: string[];

    @ApiProperty({ default: 1 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    is_active?: number;
}

export class UpdateMasterRoleDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    permissions?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    is_active?: number;
}
