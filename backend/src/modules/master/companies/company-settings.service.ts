import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanySettings } from './company-settings.entity';

@Injectable()
export class CompanySettingsService {
    constructor(
        @InjectRepository(CompanySettings)
        private readonly settingsRepository: Repository<CompanySettings>,
    ) { }

    async create(data: Partial<CompanySettings>): Promise<CompanySettings> {
        const settings = this.settingsRepository.create(data);
        return await this.settingsRepository.save(settings);
    }

    async findAll(): Promise<CompanySettings[]> {
        return await this.settingsRepository.find({ where: { is_deleted: 0 } });
    }

    async findByCompany(companyId: number): Promise<CompanySettings> {
        const settings = await this.settingsRepository.findOne({
            where: { company_id: companyId, is_deleted: 0 }
        });
        if (!settings) {
            throw new NotFoundException(`Settings for company ${companyId} not found`);
        }
        return settings;
    }

    async update(id: number, data: Partial<CompanySettings>): Promise<CompanySettings> {
        await this.settingsRepository.update(id, data);
        const updated = await this.settingsRepository.findOne({ where: { id } });
        if (!updated) throw new NotFoundException(`Settings with ID ${id} not found`);
        return updated;
    }

    async remove(id: number): Promise<void> {
        const settings = await this.settingsRepository.findOne({ where: { id, is_deleted: 0 } });
        if (!settings) throw new NotFoundException(`Settings with ID ${id} not found`);

        settings.is_deleted = 1;
        settings.deleted_at = new Date();
        await this.settingsRepository.save(settings);
    }
}
