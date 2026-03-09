import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscription_history')
export class SubscriptionHistory {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'int', nullable: true })
    company_id: number;

    @Column({ type: 'varchar', length: 100 })
    plan_name: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({ type: 'varchar', length: 100, nullable: true })
    transaction_id: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    payment_mode: string;

    @Column({ type: 'datetime' })
    paid_on: Date;

    @Column({ type: 'datetime' })
    valid_from: Date;

    @Column({ type: 'datetime' })
    valid_to: Date;

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

    @Column({ type: 'datetime', precision: 6, nullable: true })
    deleted_at: Date;

    @Column({ type: 'bigint', nullable: true })
    created_by: number;

    @Column({ type: 'bigint', nullable: true })
    updated_by: number;
}
