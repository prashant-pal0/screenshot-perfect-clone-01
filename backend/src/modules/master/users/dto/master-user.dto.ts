import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEmail, IsInt, Min, Max, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMasterUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(120)
    name: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(255)
    email: string;

    @ApiProperty({ required: false, description: 'User password. Will be hashed before saving.' })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password_hash?: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    role_id: number;

    @ApiProperty({ default: 1 })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    is_active?: number;
}

export class UpdateMasterUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(120)
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    @MaxLength(255)
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password_hash?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    role_id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1)
    is_active?: number;
}
