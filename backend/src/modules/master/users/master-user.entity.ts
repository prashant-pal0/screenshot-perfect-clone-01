import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MasterRole } from '../roles/master-role.entity';

@Entity('master_users')
export class MasterUser {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'text', select: false })
    password_hash?: string;

    @Column({ type: 'bigint', nullable: true })
    role_id: number;

    @ManyToOne(() => MasterRole)
    @JoinColumn({ name: 'role_id' })
    role: MasterRole;

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
