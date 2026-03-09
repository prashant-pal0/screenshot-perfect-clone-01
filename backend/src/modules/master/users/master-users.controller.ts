import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { MasterUsersService } from './master-users.service';
import { CreateMasterUserDto, UpdateMasterUserDto } from './dto/master-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Master Users')
@Controller('master-users')
export class MasterUsersController {
    constructor(private readonly usersService: MasterUsersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new master user' })
    create(@Body() data: CreateMasterUserDto) {
        return this.usersService.create(data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all master users' })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get master user by ID' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update master user info' })
    update(@Param('id') id: string, @Body() data: UpdateMasterUserDto) {
        return this.usersService.update(+id, data);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete a master user' })
    remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
