const fs = require('fs');
fs.writeFileSync('output.json', JSON.stringify({status: 'started'}));
require('dotenv').config();
const sql = require('mssql');

async function testConnection() {
    try {
        const fullServer = process.env.DB_SERVER;
        const [server, instanceName] = fullServer.split('\\');
        
        const config = {
            user: process.env.DB_USER,
            password: process.env.DB_password || process.env.DB_PASSWORD,
            server: 'localhost',
            port: 1433,
            database: process.env.DB_DATABASE,
            options: {
                encrypt: process.env.DB_ENCRYPT === 'true',
                trustServerCertificate: process.env.DB_TRUST_CERT === 'true'
            }
        };

        fs.writeFileSync('output.json', JSON.stringify({status: 'connecting', config: {...config, password: '***'}}));
        const pool = await sql.connect(config);
        fs.writeFileSync('output.json', JSON.stringify({status: 'connected'}));
        await pool.close();
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('output.json', JSON.stringify({status: 'failed', error: err.message}));
        process.exit(1);
    }
}

testConnection();
