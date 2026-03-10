import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ScrapedList } from './scraped-list.entity';

@Entity('scraped_leads')
export class ScrapedLead {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'bigint' })
    scraped_list_id: number;

    @ManyToOne(() => ScrapedList, list => list.leads, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'scraped_list_id' })
    scraped_list: ScrapedList;

    @Column({ type: 'varchar', length: 50, default: 'new' })
    status: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    name: string | null;

    @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
    rating: number | null;

    @Column({ type: 'int', nullable: true })
    review_count: number | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    category: string | null;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    address: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    open_status: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    close_time: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    contact_no: string | null;

    @Column({ type: 'text', nullable: true })
    website: string | null;

    @Column({ type: 'text', nullable: true })
    website_with_utm: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    utm_source: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    utm_medium: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    utm_campaign: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    utm_content: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    utm_term: string | null;

    @Column({ type: 'text', nullable: true })
    directions_url: string | null;

    @Column({ type: 'text', nullable: true })
    profile_image: string | null;

    @Column({ type: 'text', nullable: true })
    google_maps_link: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    place_id: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    click_id: string | null;

    @Column({ type: 'text', nullable: true })
    click_metadata: string | null;

    @CreateDateColumn({ type: 'datetime', precision: 6, default: () => 'CURRENT_TIMESTAMP(6)' })
    created_at: Date;
}
