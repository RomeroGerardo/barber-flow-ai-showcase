const fs = require('fs');
const path = require('path');
const MercadoPagoConfig = require('mercadopago').MercadoPagoConfig;
const Preference = require('mercadopago').Preference;

// Load env
try {
    const envPath = path.resolve(__dirname, '../.env.local');
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
        if (line.includes('=')) {
            const [key, val] = line.split('=');
            if (key && val) process.env[key.trim()] = val.trim();
        }
    });
} catch (e) {
    console.error('Error loading .env.local:', e.message);
}

if (!process.env.MP_ACCESS_TOKEN) {
    console.error('MP_ACCESS_TOKEN is missing');
    process.exit(1);
}

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN,
    options: { timeout: 5000 }
});

const preference = new Preference(client);

async function test() {
    try {
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'test-123',
                        title: 'Seña: Corte de Cabello',
                        quantity: 1,
                        unit_price: 100,
                        currency_id: 'ARS',
                    },
                ],
                payer: {
                    email: 'test_user@test.com',
                    name: 'Generico',
                },
                back_urls: {
                    success: 'http://localhost:3000/booking/success',
                    failure: 'http://localhost:3000/booking/failure',
                    pending: 'http://localhost:3000/booking/pending',
                },
                // auto_return: 'approved', // Disabled
                external_reference: 'test-ref-123',
                notification_url: 'http://localhost:3000/api/webhook/mercadopago', // Enabled
                statement_descriptor: 'BarberFlow',
            }
        });
        console.log('Success - ID:', result.id);
        console.log('Success - Init Point:', result.init_point);
        console.log('Success - Sandbox Init Point:', result.sandbox_init_point);

    } catch (error) {
        console.error('Error creating preference:', JSON.stringify(error, null, 2));
    }
}

test();
