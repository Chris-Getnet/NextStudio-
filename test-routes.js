const http = require('http');

function testRoute(url, expectedStatus = 200) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`${url}: Status ${res.statusCode} ${res.statusCode === expectedStatus ? '✅' : '❌'}`);
                resolve({ status: res.statusCode, data });
            });
        });

        req.on('error', (err) => {
            console.log(`${url}: Error ${err.message} ❌`);
            resolve({ status: 0, error: err.message });
        });

        req.setTimeout(5000, () => {
            req.destroy();
            console.log(`${url}: Timeout ❌`);
            resolve({ status: 0, error: 'timeout' });
        });
    });
}

async function testAllRoutes() {
    const baseUrl = 'http://localhost:4000/api/NextStudio';

    console.log('Testing portfolio routes...\n');

    // Test working routes first
    await testRoute(`${baseUrl}/quote`);
    await testRoute(`${baseUrl}/portfolio`);
    await testRoute(`${baseUrl}/portfolio/length`);

    // Test the new by ID route
    console.log('\nTesting portfolio by ID...');
    await testRoute(`${baseUrl}/portfolio/df4108ce-f9ad-456b-b971-1a095bb1e368`);
    await testRoute(`${baseUrl}/portfolio/82d15704-6951-433f-a206-0f2db41944b2`, 404); // This might not exist

    console.log('\nRoute testing complete!');
}

testAllRoutes();



