import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_POOL } from './database/database.module';
import type * as sql from 'mssql';

@Injectable()
export class AppService {
  constructor(@Inject(DATABASE_POOL) private pool: sql.ConnectionPool) {}

  async getDbTest(): Promise<any> {
    const result = await this.pool.request().query('SELECT TOP(1) 1 as val');
    return result.recordset;
  }
}
