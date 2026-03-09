import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new company' })
    create(@Body() data: CreateCompanyDto) {
        return this.companiesService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all active companies' })
    findAll() {
        return this.companiesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get company by ID' })
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update company info' })
    update(@Param('id') id: string, @Body() data: UpdateCompanyDto) {
        return this.companiesService.update(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a company' })
    remove(@Param('id') id: string) {
        return this.companiesService.remove(+id);
    }
}
