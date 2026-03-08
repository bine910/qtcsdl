import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { DATABASE_POOL } from '../database/database.module';
import * as sql from 'mssql';
import { isSafeSelectQuery } from './utils/sql-validator';

@Injectable()
export class QueryService {
  constructor(@Inject(DATABASE_POOL) private pool: sql.ConnectionPool) { }

  async executeQuery(query: string) {
    if (!isSafeSelectQuery(query)) {
      throw new BadRequestException('Only SELECT queries allowed');
    }

    const result = await this.pool.request().query(query);
    return result.recordset;
  }
}
