import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('company_settings')
export class CompanySettings {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    company_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phone: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    website: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    state: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    gst_number: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    pan_number: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    account_name: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    account_email: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    logo_url: string;

    @Column({ type: 'varchar', length: 10, default: 'INR' })
    default_currency: string;

    @Column({ type: 'int', nullable: true })
    company_id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address: string;

    @Column({ type: 'tinyint', default: 0 })
    is_deleted: number;

    @Column({ type: 'datetime', precision: 6, nullable: true })
    deleted_at: Date;

    @CreateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @UpdateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_on: Date;

    @Column({ type: 'bigint', nullable: true })
    created_by: number;

    @Column({ type: 'bigint', nullable: true })
    updated_by: number;

    @Column({ type: 'json', nullable: true })
    invoice_settings: any;

    @Column({ type: 'json', nullable: true })
    proforma_settings: any;

    @Column({ type: 'json', nullable: true })
    invoice_design: any;

    @Column({ type: 'json', nullable: true })
    proforma_design: any;
}
