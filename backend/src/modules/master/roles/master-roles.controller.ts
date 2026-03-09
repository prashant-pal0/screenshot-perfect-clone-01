import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MasterRolesService } from './master-roles.service';
import { CreateMasterRoleDto, UpdateMasterRoleDto } from './dto/master-role.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Master Roles')
@Controller('master-roles')
export class MasterRolesController {
    constructor(private readonly rolesService: MasterRolesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new master role' })
    create(@Body() data: CreateMasterRoleDto) {
        return this.rolesService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all master roles' })
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get role by ID' })
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update role permissions' })
    update(@Param('id') id: string, @Body() data: UpdateMasterRoleDto) {
        return this.rolesService.update(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a role' })
    remove(@Param('id') id: string) {
        return this.rolesService.remove(+id);
    }
}
