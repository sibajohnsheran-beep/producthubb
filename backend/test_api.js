/**
 * Automated Test Suite for Product Management REST API
 * Tests all 12 test cases against the Express server in-memory.
 */

const http = require('http');
const app = require('./server');

function makeRequest(server, options, requestData = null) {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    const reqOptions = {
      hostname: '127.0.0.1',
      port: addr.port,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (requestData) {
      req.write(JSON.stringify(requestData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Backend API Test Suite...\n');

  // Spin up an ephemeral test server on random free port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. GET all products
    const res1 = await makeRequest(server, { path: '/api/products', method: 'GET' });
    assert(
      res1.status === 200 && res1.data.success === true && Array.isArray(res1.data.data) && res1.data.data.length > 0,
      '1. GET all products returns status 200 and product list'
    );

    // 2. GET product by valid ID
    const res2 = await makeRequest(server, { path: '/api/products/1', method: 'GET' });
    assert(
      res2.status === 200 && res2.data.success === true && res2.data.data.id === 1,
      '2. GET product by valid ID returns status 200 and matching product'
    );

    // 3. GET product by invalid ID
    const res3 = await makeRequest(server, { path: '/api/products/invalid-id-!@#', method: 'GET' });
    assert(
      res3.status === 400 && res3.data.success === false && res3.data.message === 'Invalid product ID',
      '3. GET product by invalid ID returns status 400 (Invalid product ID)'
    );

    // GET product by non-existing ID (404)
    const res3b = await makeRequest(server, { path: '/api/products/999999', method: 'GET' });
    assert(
      res3b.status === 404 && res3b.data.success === false && res3b.data.message === 'Product not found',
      '3b. GET non-existing ID returns status 404'
    );

    // 4. POST valid product
    const validProduct = {
      name: 'Wireless Ergonomic Trackball',
      category: 'Accessories',
      price: 89.99,
      sku: 'ACC-TRK-01'
    };
    const res4 = await makeRequest(server, { path: '/api/products', method: 'POST' }, validProduct);
    assert(
      res4.status === 201 && res4.data.success === true && res4.data.data.name === validProduct.name,
      '4. POST valid product returns status 201 and created product'
    );
    const createdId = res4.data.data ? res4.data.data.id : null;

    // 5. POST missing name
    const res5 = await makeRequest(server, { path: '/api/products', method: 'POST' }, {
      category: 'Accessories',
      price: 50
    });
    assert(
      res5.status === 400 && res5.data.success === false && res5.data.errors && res5.data.errors.name,
      '5. POST missing name returns status 400 with name error'
    );

    // 6. POST missing category
    const res6 = await makeRequest(server, { path: '/api/products', method: 'POST' }, {
      name: 'Test Item',
      price: 50
    });
    assert(
      res6.status === 400 && res6.data.success === false && res6.data.errors && res6.data.errors.category,
      '6. POST missing category returns status 400 with category error'
    );

    // 7. POST missing price
    const res7 = await makeRequest(server, { path: '/api/products', method: 'POST' }, {
      name: 'Test Item',
      category: 'Electronics'
    });
    assert(
      res7.status === 400 && res7.data.success === false && res7.data.errors && res7.data.errors.price,
      '7. POST missing price returns status 400 with price error'
    );

    // 8. POST negative/zero price
    const res8 = await makeRequest(server, { path: '/api/products', method: 'POST' }, {
      name: 'Test Item',
      category: 'Electronics',
      price: -10
    });
    assert(
      res8.status === 400 && res8.data.success === false && res8.data.errors && res8.data.errors.price,
      '8. POST negative price returns status 400 with price > 0 validation'
    );

    // 9. PUT valid product
    const res9 = await makeRequest(server, { path: `/api/products/${createdId}`, method: 'PUT' }, {
      name: 'Wireless Ergonomic Trackball Ultra',
      price: 99.99
    });
    assert(
      res9.status === 200 && res9.data.success === true && res9.data.data.price === 99.99,
      '9. PUT valid product returns status 200 and updated fields'
    );

    // 10. PUT non-existing product
    const res10 = await makeRequest(server, { path: '/api/products/888888', method: 'PUT' }, {
      name: 'Ghost item',
      price: 100
    });
    assert(
      res10.status === 404 && res10.data.success === false && res10.data.message === 'Product not found',
      '10. PUT non-existing product returns status 404'
    );

    // 11. DELETE valid product
    const res11 = await makeRequest(server, { path: `/api/products/${createdId}`, method: 'DELETE' });
    assert(
      res11.status === 200 && res11.data.success === true && res11.data.message === 'Product deleted successfully',
      '11. DELETE valid product returns status 200'
    );

    // 12. DELETE non-existing product
    const res12 = await makeRequest(server, { path: `/api/products/${createdId}`, method: 'DELETE' });
    assert(
      res12.status === 404 && res12.data.success === false && res12.data.message === 'Product not found',
      '12. DELETE non-existing product returns status 404'
    );

  } catch (err) {
    console.error('Test execution error:', err);
    failed++;
  } finally {
    server.close();
    console.log(`\n========================================`);
    console.log(`Summary: ${passed} passed, ${failed} failed`);
    console.log(`========================================\n`);
  }
}

if (require.main === module) {
  runTests();
}

module.exports = runTests;
