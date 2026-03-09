import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    username: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'master_crm',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true, // Set to false in production
    logging: true,
};
