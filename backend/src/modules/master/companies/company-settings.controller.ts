import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CompanySettingsService } from './company-settings.service';
import { CompanySettings } from './company-settings.entity';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Company Settings')
@Controller('company-settings')
export class CompanySettingsController {
    constructor(private readonly settingsService: CompanySettingsService) { }

    @Post()
    @ApiOperation({ summary: 'Create company settings' })
    create(@Body() data: Partial<CompanySettings>) {
        return this.settingsService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all company settings' })
    findAll() {
        return this.settingsService.findAll();
    }

    @Get('company/:companyId')
    @ApiOperation({ summary: 'Get settings by company ID' })
    findByCompany(@Param('companyId') companyId: string) {
        return this.settingsService.findByCompany(+companyId);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update company settings' })
    update(@Param('id') id: string, @Body() data: Partial<CompanySettings>) {
        return this.settingsService.update(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete company settings' })
    remove(@Param('id') id: string) {
        return this.settingsService.remove(+id);
    }
}
