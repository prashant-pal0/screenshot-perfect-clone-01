const API_URL = 'http://localhost:3000';

async function testApi(name, path, method, payload, expectedStatus) {
    console.log(`\n▶ [TEST] ${name}`);
    try {
        const res = await fetch(`${API_URL}${path}`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: payload ? JSON.stringify(payload) : undefined
        });
        
        const data = await res.json().catch(() => ({}));
        
        if (res.status === expectedStatus) {
            console.log(`✅ PASS (${res.status})`);
            return { ok: true, data };
        } else {
            console.error(`❌ FAIL - Expected ${expectedStatus}, got ${res.status}`);
            console.error('Response:', data);
            return { ok: false, data };
        }
    } catch(err) {
        console.error(`❌ ERROR: ${err.message}`);
        return { ok: false };
    }
}

async function runTests() {
    console.log('🧪 Starting Business Logic Tests...');

    // 1. Test DTO Validation (Missing required field)
    await testApi(
        'Create Sub without company_id (Should 400 Bad Request)',
        '/subscriptions',
        'POST',
        { plan_name: 'Test Plan', amount: 99.00, start_date: new Date().toISOString(), end_date: new Date().toISOString() },
        400
    );

    // 2. Test Date Validation (End Date < Start Date)
    const validCompanyRes = await fetch(`${API_URL}/companies`).then(r => r.json());
    const testCompanyId = validCompanyRes[0]?.id;

    if (testCompanyId) {
        await testApi(
            'Create Sub with End Date < Start Date (Should 400 Bad Request)',
            '/subscriptions',
            'POST',
            { 
                company_id: testCompanyId, 
                plan_name: 'Time Travel Plan', 
                amount: 100, 
                start_date: new Date('2030-01-01').toISOString(), 
                end_date: new Date('2029-01-01').toISOString() 
            },
            400
        );

        // 3. Test Subscription Archiving Logic
        console.log(`\n▶ [TEST] Creating Active Sub should expire previous ones`);
        const now = new Date();
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const newSub = await testApi(
            'Creating New Active Subscription (Should 201)',
            '/subscriptions',
            'POST',
            {
                company_id: testCompanyId,
                plan_name: 'New Overwrite Plan',
                amount: 999,
                status: 'Active',
                start_date: now.toISOString(),
                end_date: nextMonth.toISOString()
            },
            201
        );

        if (newSub.ok) {
            const companySubsRes = await fetch(`${API_URL}/subscriptions/company/${testCompanyId}`).then(r => r.json());
            const activeCount = companySubsRes.filter(s => s.status === 'Active').length;
            if (activeCount === 1) {
                console.log(`✅ PASS - Only 1 active subscription remains`);
            } else {
                console.error(`❌ FAIL - Expected 1 active subscription, found ${activeCount}`);
            }
        }
    } else {
        console.log('Skipping subscription logic tests - no companies available');
    }

    // 4. Test Role Deletion Constraint
    const validRoleRes = await fetch(`${API_URL}/master-roles`).then(r => r.json());
    // Get a role that is assigned to a user (e.g. Super Admin)
    const activeRole = validRoleRes.find(r => r.name.includes('Super Admin'));
    
    if (activeRole) {
        await testApi(
            'Delete Role assigned to active users (Should 409 Conflict)',
            `/master-roles/${activeRole.id}`,
            'DELETE',
            null,
            409
        );
    }

    // 5. Test Unique Email
    await testApi(
        'Create User with duplicate email (Should 409 Conflict)',
        '/master-users',
        'POST',
        {
            name: 'Cloned Admin',
            email: 'rahul.admin@mastercrm.in', // This was seeded
            password_hash: 'Password123!',
            role_id: activeRole ? activeRole.id : 1
        },
        409 // Assuming this fails because the DB enforce unique or the service does. Notice seed.js modified the seeded emails by appending a ts, we'll see if it fails based on dynamic duplicate or pass. Let's just create a test user and try to clone it.
    );
    
    // Better dynamic unique email test
    const testEmail = 'unique_clone_test@mastercrm.in';
    const firstClone = await testApi('Create Unique User', '/master-users', 'POST', { name: 'First', email: testEmail, password_hash: 'Pass!123', role_id: activeRole ? activeRole.id : 1}, 201);
    
    if (firstClone.ok) {
        await testApi('Create Duplicate User', '/master-users', 'POST', { name: 'Second', email: testEmail, password_hash: 'Pass!123', role_id: activeRole ? activeRole.id : 1}, 409);
    }
}

runTests();
