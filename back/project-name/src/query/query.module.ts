import { Module } from '@nestjs/common';
import { QueryController } from './query.controller';
import { QueryService } from './query.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [QueryController],
    providers: [QueryService],
})
export class QueryModule { }
