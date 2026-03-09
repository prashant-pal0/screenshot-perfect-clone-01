import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
    ) { }

    async create(data: CreateCompanyDto): Promise<Company> {
        const existing = await this.companyRepository.findOne({ where: { code: data.code } });
        if (existing) throw new ConflictException(`Company code '${data.code}' already exists`);

        const company = this.companyRepository.create(data);
        return await this.companyRepository.save(company);
    }

    async findAll(): Promise<Company[]> {
        return await this.companyRepository.find({ where: { is_deleted: 0 } });
    }

    async findOne(id: number): Promise<Company> {
        const company = await this.companyRepository.findOne({ where: { id, is_deleted: 0 } });
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async update(id: number, data: UpdateCompanyDto): Promise<Company> {
        await this.findOne(id);

        if (data.code) {
            const existing = await this.companyRepository.findOne({ where: { code: data.code, id: Not(id) } });
            if (existing) throw new ConflictException(`Company code '${data.code}' already exists`);
        }

        await this.companyRepository.update(id, data);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        const company = await this.findOne(id);

        company.is_deleted = 1;
        company.deleted_at = new Date();
        await this.companyRepository.save(company);

        // Cascade logical soft-deletes securely via manager
        await this.companyRepository.manager.query(`UPDATE subscriptions SET status = 'Cancelled', is_deleted = 1, deleted_at = NOW() WHERE company_id = ?`, [id]);
        await this.companyRepository.manager.query(`UPDATE company_settings SET is_deleted = 1 WHERE company_id = ?`, [id]);
    }
}
