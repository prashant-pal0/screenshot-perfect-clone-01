import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterRole } from './master-role.entity';
import { CreateMasterRoleDto, UpdateMasterRoleDto } from './dto/master-role.dto';

@Injectable()
export class MasterRolesService {
    constructor(
        @InjectRepository(MasterRole)
        private readonly roleRepository: Repository<MasterRole>,
    ) { }

    async create(data: CreateMasterRoleDto): Promise<MasterRole> {
        const role = this.roleRepository.create(data);
        return await this.roleRepository.save(role);
    }

    async findAll(): Promise<MasterRole[]> {
        return await this.roleRepository.find({ where: { is_deleted: 0 } });
    }

    async findOne(id: number): Promise<MasterRole> {
        const role = await this.roleRepository.findOne({ where: { id, is_deleted: 0 } });
        if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
        return role;
    }

    async update(id: number, data: UpdateMasterRoleDto): Promise<MasterRole> {
        await this.findOne(id);
        await this.roleRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const role = await this.findOne(id);

        // Prevent deletion if users are still assigned to this role
        const activeUsersCount = await this.roleRepository.manager.query(
            `SELECT COUNT(*) as count FROM master_users WHERE role_id = ? AND is_deleted = 0`,
            [id]
        );

        if (activeUsersCount[0].count > 0) {
            throw new ConflictException(`Cannot delete role '${role.name}' because it is assigned to ${activeUsersCount[0].count} active user(s).`);
        }

        role.is_deleted = 1;
        role.deleted_at = new Date();
        await this.roleRepository.save(role);
    }
}
