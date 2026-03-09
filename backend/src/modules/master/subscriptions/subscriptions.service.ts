import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription, SubscriptionStatus } from './subscription.entity';
import { SubscriptionHistory } from './subscription-history.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectRepository(Subscription)
        private readonly subscriptionRepository: Repository<Subscription>,
        @InjectRepository(SubscriptionHistory)
        private readonly historyRepository: Repository<SubscriptionHistory>,
    ) { }

    async create(data: CreateSubscriptionDto): Promise<Subscription> {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);

        if (endDate <= startDate) {
            throw new BadRequestException('end_date must be strictly after start_date');
        }

        // Auto-expire previous active subscriptions for this company
        if (data.status === SubscriptionStatus.ACTIVE) {
            await this.subscriptionRepository.update(
                { company_id: data.company_id, status: SubscriptionStatus.ACTIVE, is_deleted: 0 },
                { status: SubscriptionStatus.EXPIRED, updated_at: new Date() }
            );
        }

        const payload = {
            ...data,
            start_date: startDate,
            end_date: endDate,
        };

        const subscription = this.subscriptionRepository.create(payload);
        const saved = await this.subscriptionRepository.save(subscription);

        // Create history record
        const history = this.historyRepository.create({
            company_id: saved.company_id,
            plan_name: saved.plan_name,
            amount: saved.amount,
            paid_on: new Date(),
            valid_from: saved.start_date,
            valid_to: saved.end_date,
        });
        await this.historyRepository.save(history);

        return saved;
    }

    async findAll(): Promise<Subscription[]> {
        return await this.subscriptionRepository.find({ where: { is_deleted: 0 } });
    }

    async findByCompany(companyId: number): Promise<Subscription[]> {
        return await this.subscriptionRepository.find({ where: { company_id: companyId, is_deleted: 0 } });
    }

    async findHistory(companyId: number): Promise<SubscriptionHistory[]> {
        return await this.historyRepository.find({ where: { company_id: companyId, is_deleted: 0 } });
    }

    async update(id: number, data: UpdateSubscriptionDto): Promise<Subscription> {
        const sub = await this.subscriptionRepository.findOne({ where: { id, is_deleted: 0 } });
        if (!sub) throw new NotFoundException('Subscription not found');

        const startDate = data.start_date ? new Date(data.start_date) : sub.start_date;
        const endDate = data.end_date ? new Date(data.end_date) : sub.end_date;

        if (endDate <= startDate) {
            throw new BadRequestException('end_date must be strictly after start_date');
        }

        const { start_date, end_date, ...restData } = data;
        const payload: Partial<Subscription> = { ...restData };
        if (data.start_date) payload.start_date = startDate;
        if (data.end_date) payload.end_date = endDate;

        await this.subscriptionRepository.update(id, payload);
        const updatedSub = await this.subscriptionRepository.findOne({ where: { id } });
        if (!updatedSub) throw new NotFoundException('Subscription not found after update');
        return updatedSub;
    }

    async remove(id: number): Promise<void> {
        const sub = await this.subscriptionRepository.findOne({ where: { id, is_deleted: 0 } });
        if (!sub) throw new NotFoundException('Subscription not found');

        sub.is_deleted = 1;
        sub.deleted_at = new Date();
        await this.subscriptionRepository.save(sub);
    }
}
