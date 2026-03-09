import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('master_roles')
export class MasterRole {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    permissions: any;

    @Column({ type: 'tinyint', default: 1 })
    is_active: number;

    @CreateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @Column({ type: 'tinyint', default: 0 })
    is_deleted: number;

    @Column({ type: 'datetime', precision: 6, nullable: true })
    deleted_at: Date;

    @UpdateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updated_on: Date;

    @Column({ type: 'bigint', nullable: true })
    created_by: number;

    @Column({ type: 'bigint', nullable: true })
    updated_by: number;
}
