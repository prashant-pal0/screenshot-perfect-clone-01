import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoogleMapsScraperService } from './google-maps-scraper.service';
import { GoogleMapsScraperController } from './google-maps-scraper.controller';
import { Company } from '../master/companies/company.entity';
import { ScrapedList } from './entities/scraped-list.entity';
import { ScrapedLead } from './entities/scraped-lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, ScrapedList, ScrapedLead])],
  controllers: [GoogleMapsScraperController],
  providers: [GoogleMapsScraperService],
  exports: [GoogleMapsScraperService],
})
export class GoogleMapsScraperModule { }