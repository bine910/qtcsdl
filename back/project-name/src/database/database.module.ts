import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

export const DATABASE_POOL = 'DATABASE_POOL';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: DATABASE_POOL,
            useFactory: async (config: ConfigService) => {
                const pool = await sql.connect({
                    user: config.get<string>('DB_USER'),
                    password: config.get<string>('DB_PASSWORD'),
                    server: config.get<string>('DB_SERVER') || 'localhost',
                    port: parseInt(config.get<string>('DB_PORT') || '1433'),
                    database: config.get<string>('DB_DATABASE'),
                    options: {
                        encrypt: config.get('DB_ENCRYPT') === 'true',
                        trustServerCertificate: config.get('DB_TRUST_CERT') === 'true',
                    },
                });
                return pool;
            },
            inject: [ConfigService],
        }
    ],
    exports: [DATABASE_POOL],
})
export class DatabaseModule { }
