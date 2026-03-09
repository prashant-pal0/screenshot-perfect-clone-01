const API_URL = 'http://localhost:3000';

const roles = [
    { name: 'Super Admin', description: 'Full access to all master CRM features', permissions: ['companies:read', 'companies:write', 'subscriptions:read', 'subscriptions:write', 'users:read', 'users:write', 'roles:read', 'roles:write', 'settings:read', 'settings:write'], is_active: 1 },
    { name: 'Support Manager', description: 'Manage client subscriptions and support', permissions: ['companies:read', 'subscriptions:read', 'subscriptions:write', 'users:read', 'settings:read'], is_active: 1 },
    { name: 'Sales Executive', description: 'View client data for sales pipeline', permissions: ['companies:read', 'subscriptions:read'], is_active: 1 }
];

const companiesData = [
    { 
        company: { name: 'TechNova Solutions Pvt Ltd', code: 'TECH-IN-01', is_active: 1 },
        settings: { email: 'contact@technova.in', phone: '+91-9876543210', website: 'https://technova.in', state: 'Maharashtra', gst_number: '27AABCT1234D1Z5', pan_number: 'AABCT1234D', address: 'Baner, Pune, MH 411045' },
        subscription: { plan_name: 'Tour CRM - Enterprise', amount: 15000.00, seats: 25, status: 'Active', months: 12 }
    },
    { 
        company: { name: 'Wanderlust Travels Ltd', code: 'WND-MUM-99', is_active: 1 },
        settings: { email: 'hello@wanderlust.co.in', phone: '+91-8888888888', website: 'https://wanderlust.co.in', state: 'Delhi', gst_number: '07AAACW1111E1Z6', pan_number: 'AAACW1111E', address: 'Connaught Place, New Delhi 110001' },
        subscription: { plan_name: 'Travel CRM - Pro', amount: 8500.00, seats: 10, status: 'Active', months: 6 }
    },
    { 
        company: { name: 'Global Horizons Inc.', code: 'GLO-001', is_active: 1 },
        settings: { email: 'admin@globalhorizons.com', phone: '+1-555-123-4567', website: 'https://globalhorizons.com', state: 'Karnataka', gst_number: '29ABCDE1234F1Z1', pan_number: 'ABCDE1234F', address: 'Koramangala, Bengaluru 560034' },
        subscription: { plan_name: 'Tour CRM - Starter', amount: 3500.00, seats: 3, status: 'Active', months: 3 }
    },
    { 
        company: { name: 'Apex Logistics', code: 'APX-LOG-22', is_active: 0 },
        settings: { email: 'info@apexlogistics.io', phone: '+91-9999900000', website: 'https://apexlogistics.io', state: 'Tamil Nadu', gst_number: '33AABCA8888D1Z8', pan_number: 'AABCA8888D', address: 'Guindy, Chennai 600032' },
        subscription: { plan_name: 'Travel CRM - Basic', amount: 1500.00, seats: 1, status: 'Expired', months: 1 }
    }
];

const ts = Date.now().toString().slice(-4);

const masterUsers = [
    { name: `Rahul Sharma ${ts}`, email: `rahul.admin${ts}@mastercrm.in`, password_hash: 'Password123!', is_active: 1 },
    { name: `Priya Patel ${ts}`, email: `priya.support${ts}@mastercrm.in`, password_hash: 'Password123!', is_active: 1 },
    { name: `Amit Desai ${ts}`, email: `amit.sales${ts}@mastercrm.in`, password_hash: 'Password123!', is_active: 1 }
];

async function api(path, payload) {
    const res = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error(`\n[API REJECTED] POST ${path}: ${res.status} ${res.statusText}`);
        console.error(`[PAYLOAD]`, JSON.stringify(payload));
        console.error(`[RESPONSE]`, errorText, `\n`);
        throw new Error(`Failed to POST ${path}`);
    }
    return res.json();
}

async function seed() {
    console.log('🌱 Starting Master CRM database seeding...');
    
    // 1. Create Roles
    console.log('Creating Master Roles...');
    const createdRoles = [];
    for (const role of roles) {
        try {
            const rPayload = { ...role, name: `${role.name} ${ts}` };
            const r = await api('/master-roles', rPayload);
            createdRoles.push(r);
            console.log(` - Role: ${r.name}`);
        } catch(e) { console.error('Failed role', e.message); }
    }

    // 2. Create Users
    console.log('\nCreating Master Users...');
    const createdUsers = [];
    for (let i = 0; i < masterUsers.length; i++) {
        try {
            const userPayload = { ...masterUsers[i], role_id: createdRoles[i].id };
            const u = await api('/master-users', userPayload);
            createdUsers.push(u);
            console.log(` - User: ${u.name} (${createdRoles[i].name})`);
        } catch(e) { console.error('Failed user', e.message); }
    }

    // 3. Create Companies, Settings, and Subscriptions
    console.log('\nCreating Companies, Settings, and Subscriptions...');
    for (const cData of companiesData) {
        // Company
        const comp = await api('/companies', cData.company);
        console.log(` - Company: ${comp.name}`);

        // Settings
        const settingsPayload = { ...cData.settings, company_id: comp.id };
        await api('/company-settings', settingsPayload);
        console.log(`   └─ Settings Added`);

        // Subscription
        const now = new Date();
        const end = new Date(now);
        end.setMonth(end.getMonth() + cData.subscription.months);
        if (cData.subscription.status === 'Expired') {
            now.setMonth(now.getMonth() - cData.subscription.months - 1);
            end.setMonth(end.getMonth() - cData.subscription.months - 1);
        }

        const subPayload = {
            company_id: comp.id,
            plan_name: cData.subscription.plan_name,
            amount: cData.subscription.amount,
            seats: cData.subscription.seats,
            status: cData.subscription.status,
            start_date: now.toISOString(),
            end_date: end.toISOString()
        };
        await api('/subscriptions', subPayload);
        console.log(`   └─ Subscription: ${subPayload.plan_name} (${subPayload.status})`);
    }

    console.log('\n✅ Seeding complete! All relational data has been injected.');
}

seed().catch(err => console.error('Seeding Error:', err));
