import { Module ,Global} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService,ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { QueryModule } from './query/query.module';
import * as sql from 'mssql';
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    DatabaseModule,
    QueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
