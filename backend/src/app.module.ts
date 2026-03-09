import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleMapsScraperModule } from './modules/google-maps-scraper/google-maps-scraper.module';
import { MasterModule } from './modules/master/master.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { databaseConfig } from './databases/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('HOST') || 'localhost',
        port: configService.get<number>('MYSQL_PORT') || 3306,
        username: configService.get<string>('MYSQL_USERNAME') || 'root',
        password: configService.get<string>('MYSQL_PASSWORD') || '',
        database: configService.get<string>('MYSQL_DATABASE') || 'master_crm',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
    GoogleMapsScraperModule,
    MasterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
