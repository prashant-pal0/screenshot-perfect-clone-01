import { IsString, IsNotEmpty, IsOptional, MaxLength, IsNumber, IsInt, Min, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatus } from '../subscription.entity';

export class CreateSubscriptionDto {
    @ApiProperty()
    @IsInt()
    @Min(1)
    company_id: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    plan_name: string;

    @ApiProperty({ enum: SubscriptionStatus, default: SubscriptionStatus.PENDING })
    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;

    @ApiProperty()
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty()
    @IsDateString()
    start_date: string;

    @ApiProperty()
    @IsDateString()
    end_date: string;
}

export class UpdateSubscriptionDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    company_id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    plan_name?: string;

    @ApiProperty({ required: false, enum: SubscriptionStatus })
    @IsOptional()
    @IsEnum(SubscriptionStatus)
    status?: SubscriptionStatus;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    amount?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    start_date?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    end_date?: string;
}
