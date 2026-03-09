import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SubscriptionStatus {
    ACTIVE = 'Active',
    EXPIRED = 'Expired',
    PENDING = 'Pending',
    CANCELLED = 'Cancelled',
}

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'int', nullable: true })
    company_id: number;

    @Column({ type: 'varchar', length: 100 })
    plan_name: string;

    @Column({
        type: 'enum',
        enum: SubscriptionStatus,
        default: SubscriptionStatus.PENDING,
    })
    status: SubscriptionStatus;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
    amount: number;

    @Column({ type: 'datetime', nullable: true })
    start_date: Date;

    @Column({ type: 'datetime', nullable: true })
    end_date: Date;

    @Column({ type: 'tinyint', default: 0 })
    is_deleted: number;

    @CreateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({
        type: 'datetime',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updated_on: Date;

    @UpdateDateColumn({
        type: 'datetime',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updated_at: Date;

    @Column({ type: 'datetime', precision: 6, nullable: true })
    deleted_at: Date;

    @Column({ type: 'bigint', nullable: true })
    created_by: number;

    @Column({ type: 'bigint', nullable: true })
    updated_by: number;
}
