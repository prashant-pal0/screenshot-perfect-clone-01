import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
    @ApiProperty({ description: 'The name of the company' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiProperty({ description: 'A unique code identifying the company' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    code: string;

    @ApiProperty({ description: 'Company active status flag (1 or 0)', default: 1 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    is_active?: number;
}

export class UpdateCompanyDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    code?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    is_active?: number;
}
