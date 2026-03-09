import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) { }

    @Post()
    @ApiOperation({ summary: 'Assign a new subscription to a company' })
    create(@Body() data: CreateSubscriptionDto) {
        return this.subscriptionsService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all active subscriptions' })
    findAll() {
        return this.subscriptionsService.findAll();
    }

    @Get('company/:companyId')
    @ApiOperation({ summary: 'Get subscriptions by company' })
    findByCompany(@Param('companyId') companyId: string) {
        return this.subscriptionsService.findByCompany(+companyId);
    }

    @Get('history/:companyId')
    @ApiOperation({ summary: 'Get subscription history for a company' })
    findHistory(@Param('companyId') companyId: string) {
        return this.subscriptionsService.findHistory(+companyId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update subscription details' })
    update(@Param('id') id: string, @Body() data: UpdateSubscriptionDto) {
        return this.subscriptionsService.update(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a subscription' })
    remove(@Param('id') id: string) {
        return this.subscriptionsService.remove(+id);
    }
}
