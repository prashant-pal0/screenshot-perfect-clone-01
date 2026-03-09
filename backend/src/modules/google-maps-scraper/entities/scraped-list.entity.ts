import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ScrapedLead } from './scraped-lead.entity';

@Entity('scraped_lists')
export class ScrapedList {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string;

    @Column({ type: 'int', default: 0 })
    total_leads: number;

    @Column({ type: 'varchar', length: 500, nullable: true })
    excel_file_url: string;

    @CreateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;

    @OneToMany(() => ScrapedLead, lead => lead.scraped_list, { cascade: true })
    leads: ScrapedLead[];
}
