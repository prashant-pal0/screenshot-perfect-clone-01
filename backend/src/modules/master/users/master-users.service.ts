import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { MasterUser } from './master-user.entity';
import { CreateMasterUserDto, UpdateMasterUserDto } from './dto/master-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MasterUsersService {
    constructor(
        @InjectRepository(MasterUser)
        private readonly userRepository: Repository<MasterUser>,
    ) { }

    async create(data: CreateMasterUserDto): Promise<MasterUser> {
        const existing = await this.userRepository.findOne({ where: { email: data.email } });
        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        const roleCount = await this.userRepository.manager.query(`SELECT COUNT(*) as count FROM master_roles WHERE id = ? AND is_deleted = 0`, [data.role_id]);
        if (roleCount[0].count === 0) {
            throw new NotFoundException(`Role with ID ${data.role_id} not found or inactive`);
        }

        if (data.password_hash) {
            const salt = await bcrypt.genSalt();
            data.password_hash = await bcrypt.hash(data.password_hash, salt);
        }

        const user = this.userRepository.create(data);
        const saved = await this.userRepository.save(user);
        delete saved.password_hash;
        return saved;
    }

    async findAll(): Promise<MasterUser[]> {
        return await this.userRepository.find({
            where: { is_deleted: 0 },
            relations: ['role'],
        });
    }

    async findOne(id: number): Promise<MasterUser> {
        const user = await this.userRepository.findOne({
            where: { id, is_deleted: 0 },
            relations: ['role'],
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: number, data: UpdateMasterUserDto): Promise<MasterUser> {
        await this.findOne(id);

        if (data.email) {
            const existing = await this.userRepository.findOne({ where: { email: data.email, id: Not(id) } });
            if (existing) throw new ConflictException('User with this email already exists');
        }

        if (data.role_id) {
            const roleCount = await this.userRepository.manager.query(`SELECT COUNT(*) as count FROM master_roles WHERE id = ? AND is_deleted = 0`, [data.role_id]);
            if (roleCount[0].count === 0) throw new NotFoundException(`Role with ID ${data.role_id} not found or inactive`);
        }

        if (data.password_hash) {
            const salt = await bcrypt.genSalt();
            data.password_hash = await bcrypt.hash(data.password_hash, salt);
        }

        await this.userRepository.update(id, data);
        const updated = await this.findOne(id);
        delete updated.password_hash;
        return updated;
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        user.is_deleted = 1;
        user.deleted_at = new Date();
        await this.userRepository.save(user);
    }
}
