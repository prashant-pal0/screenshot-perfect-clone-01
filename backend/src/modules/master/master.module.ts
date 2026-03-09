import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './companies/company.entity';
import { CompanySettings } from './companies/company-settings.entity';
import { Subscription } from './subscriptions/subscription.entity';
import { SubscriptionHistory } from './subscriptions/subscription-history.entity';
import { MasterUser } from './users/master-user.entity';
import { MasterRole } from './roles/master-role.entity';

import { CompaniesService } from './companies/companies.service';
import { CompanySettingsService } from './companies/company-settings.service';
import { CompaniesController } from './companies/companies.controller';
import { CompanySettingsController } from './companies/company-settings.controller';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { MasterUsersService } from './users/master-users.service';
import { MasterUsersController } from './users/master-users.controller';
import { MasterRolesService } from './roles/master-roles.service';
import { MasterRolesController } from './roles/master-roles.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Company,
            CompanySettings,
            Subscription,
            SubscriptionHistory,
            MasterUser,
            MasterRole,
        ]),
    ],
    controllers: [
        CompaniesController,
        CompanySettingsController,
        SubscriptionsController,
        MasterUsersController,
        MasterRolesController,
    ],
    providers: [
        CompaniesService,
        CompanySettingsService,
        SubscriptionsService,
        MasterUsersService,
        MasterRolesService,
    ],
    exports: [
        TypeOrmModule,
        CompaniesService,
        CompanySettingsService,
        SubscriptionsService,
        MasterUsersService,
        MasterRolesService,
    ],
})
export class MasterModule { }
