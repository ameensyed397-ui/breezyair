import http from 'http';

const BASE = 'http://localhost:3000';
let pass = 0;
let fail = 0;
const results = [];

async function testRoute({ name, method, url, body, expectedStatus, mustNotContain, mustContain, headers = {} }) {
  const options = {
    method,
    headers: { ...headers },
  };

  if (body) {
    options.headers['Content-Type'] = 'application/json';
  }

  return new Promise((resolve) => {
    const req = http.request(BASE + url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let ok = true;
        const notes = [];

        if (res.statusCode !== expectedStatus) {
          ok = false;
          notes.push(`Expected ${expectedStatus} got ${res.statusCode}`);
        }

        if (mustContain) {
          mustContain.forEach(mc => {
            if (!data.includes(mc)) {
              ok = false;
              notes.push(`Missing: ${mc}`);
            }
          });
        }

        if (mustNotContain) {
          mustNotContain.forEach(mnc => {
            if (data.includes(mnc)) {
              ok = false;
              notes.push(`LEAK: ${mnc}`);
            }
          });
        }

        const secretPatterns = ["ntn_", "AQ.Ab", "NOTION_TOKEN", "RAZORPAY_KEY_SECRET", "WHATSAPP_TOKEN", "CRON_SECRET", "breezyair_secret", "skLzsNcM"];
        secretPatterns.forEach(sp => {
          if (data.includes(sp)) {
            ok = false;
            notes.push(`SECRET LEAK: ${sp}`);
          }
        });

        if (ok) {
          console.log(`\x1b[32m  PASS  ${name}\x1b[0m`);
          pass++;
        } else {
          console.log(`\x1b[31m  FAIL  ${name} -- ${notes.join('; ')}\x1b[0m`);
          fail++;
        }

        results.push({ test: name, result: ok ? 'PASS' : 'FAIL', http: res.statusCode, notes: notes.join('; ') });
        resolve();
      });
    });

    req.on('error', (e) => {
      console.log(`\x1b[31m  FAIL  ${name} -- Exception: ${e.message}\x1b[0m`);
      fail++;
      results.push({ test: name, result: 'FAIL', http: 'ERR', notes: e.message });
      resolve();
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function run() {
  console.log("\x1b[36m=======================================================\x1b[0m");
  console.log("\x1b[36m  BREEZYAIR SMOKE TEST (Node.js)\x1b[0m");
  console.log("\x1b[36m=======================================================\x1b[0m\n");

  console.log("\x1b[33m-- Static Pages --\x1b[0m");
  await testRoute({ name: "GET / (Home)", method: 'GET', url: '/', expectedStatus: 200, mustContain: ['Breezyair', 'hero-mascot'] });
  await testRoute({ name: "GET /services", method: 'GET', url: '/services', expectedStatus: 200, mustContain: ['mascot-outdoor'] });
  await testRoute({ name: "GET /contact", method: 'GET', url: '/contact', expectedStatus: 200, mustContain: ['Asad Khan'] });
  await testRoute({ name: "GET /about", method: 'GET', url: '/about', expectedStatus: 200, mustContain: ['Asad Khan', 'asad-khan'] });
  await testRoute({ name: "GET /pricing", method: 'GET', url: '/pricing', expectedStatus: 200, mustContain: ['499', 'AMC'] });
  await testRoute({ name: "GET /book", method: 'GET', url: '/book', expectedStatus: 200, mustContain: ['Book'] });
  await testRoute({ name: "GET /b2b", method: 'GET', url: '/b2b', expectedStatus: 200, mustContain: ['b2b'] });
  await testRoute({ name: "GET /blog", method: 'GET', url: '/blog', expectedStatus: 200, mustContain: ['blog'] });

  console.log("\n\x1b[33m-- SEO and Infrastructure --\x1b[0m");
  await testRoute({ name: "GET /sitemap.xml", method: 'GET', url: '/sitemap.xml', expectedStatus: 200, mustContain: ['breezyair.co'] });
  await testRoute({ name: "GET /robots.txt", method: 'GET', url: '/robots.txt', expectedStatus: 200, mustContain: ['Sitemap'] });
  await testRoute({ name: "GET /llms.txt", method: 'GET', url: '/llms.txt', expectedStatus: 200, mustContain: ['Breezyair'] });
  await testRoute({ name: "GET /404 page", method: 'GET', url: '/nonexistent-page-xyz', expectedStatus: 404 });

  console.log("\n\x1b[33m-- Enquiry API --\x1b[0m");
  // using different IPs via headers to avoid rate limiting across tests
  const ip = (n) => ({ 'x-forwarded-for': `10.0.0.${n}` });
  
  await testRoute({ name: "Enquiry: footer callback", method: 'POST', url: '/api/enquiry', headers: ip(1), body: '{"type":"footer","phone":"9876543210"}', expectedStatus: 200, mustContain: ['success','leadId'] });
  await testRoute({ name: "Enquiry: contact form", method: 'POST', url: '/api/enquiry', headers: ip(2), body: '{"type":"contact","name":"Test User","phone":"9876543210","email":"test@example.com","locality":"Koramangala","issueType":"AC not cooling","urgency":"Normal"}', expectedStatus: 200, mustContain: ['success','leadId'] });
  await testRoute({ name: "Enquiry: booking with slot", method: 'POST', url: '/api/enquiry', headers: ip(3), body: '{"type":"booking","name":"Booking Test","phone":"9876543211","locality":"HSR Layout","issueType":"Deep clean","slotDate":"2026-07-25","slotTime":"morning","service":"wet-clean","amount":899}', expectedStatus: 200, mustContain: ['success','leadId','bookingId'] });
  await testRoute({ name: "Enquiry: B2B form", method: 'POST', url: '/api/enquiry', headers: ip(4), body: '{"type":"b2b","name":"B2B Contact","phone":"9876543212","email":"corp@example.com","company":"Acme Corp","businessType":"Office","units":20,"issueType":"Annual contract"}', expectedStatus: 200, mustContain: ['success','b2bLeadId'] });
  await testRoute({ name: "Enquiry: AMC booking", method: 'POST', url: '/api/enquiry', headers: ip(5), body: '{"type":"booking","name":"AMC Test","phone":"9876543213","locality":"Indiranagar","issueType":"AMC signup","slotDate":"2026-07-25","slotTime":"afternoon","service":"amc-bengaluru-cool","amount":2999,"acCount":2}', expectedStatus: 200, mustContain: ['success','contractId'] });
  await testRoute({ name: "Enquiry: honeypot triggered", method: 'POST', url: '/api/enquiry', headers: ip(6), body: '{"type":"contact","phone":"9876543214","honeyPot":"i am a bot"}', expectedStatus: 200, mustContain: ['success','stub_spam'] });
  await testRoute({ name: "Enquiry: validation (no phone)", method: 'POST', url: '/api/enquiry', headers: ip(7), body: '{"type":"contact","name":"No Phone"}', expectedStatus: 400, mustContain: ['error'] });
  await testRoute({ name: "Enquiry: invalid type", method: 'POST', url: '/api/enquiry', headers: ip(8), body: '{"type":"invalid","phone":"9876543215"}', expectedStatus: 400, mustContain: ['error'] });
  await testRoute({ name: "Enquiry: invalid email", method: 'POST', url: '/api/enquiry', headers: ip(9), body: '{"type":"contact","phone":"9876543216","email":"not-an-email"}', expectedStatus: 400, mustContain: ['error'] });

  console.log("\n\x1b[33m-- Payment API --\x1b[0m");
  await testRoute({ name: "Payment: create-order no keys (503)", method: 'POST', url: '/api/payment/create-order', body: '{"amount":899,"description":"Test"}', expectedStatus: 503, mustContain: ['not configured'], mustNotContain: ['RAZORPAY_KEY_ID','RAZORPAY_KEY_SECRET'] });
  await testRoute({ name: "Payment: verify no keys (503)", method: 'POST', url: '/api/payment/verify', body: '{"razorpay_order_id":"order_test","razorpay_payment_id":"pay_test","razorpay_signature":"sig_test"}', expectedStatus: 503, mustContain: ['not configured'], mustNotContain: ['RAZORPAY_KEY_SECRET'] });

  console.log("\n\x1b[33m-- Chat Agent --\x1b[0m");
  await testRoute({ name: "Chat: send message", method: 'POST', url: '/api/agent/breezy', body: '{"messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"hi my AC is not cooling"}]}]}', expectedStatus: 200, mustNotContain: ['GOOGLE_GENERATIVE_AI_API_KEY','ntn_'] });

  console.log("\n\x1b[33m-- Care Cron --\x1b[0m");
  await testRoute({ name: "Care cron: no auth (401)", method: 'GET', url: '/api/agent/care/run', expectedStatus: 401, mustContain: ['Unauthorized'], mustNotContain: ['breezyair_secret'] });
  await testRoute({ name: "Care cron: wrong auth (401)", method: 'GET', url: '/api/agent/care/run', headers: { 'Authorization': 'Bearer wrong_secret' }, expectedStatus: 401, mustContain: ['Unauthorized'] });
  await testRoute({ name: "Care cron: valid auth (200)", method: 'GET', url: '/api/agent/care/run', headers: { 'Authorization': 'Bearer breezyair_secret_cron_secure_key_12345' }, expectedStatus: 200, mustContain: ['ok'] });

  console.log("\n\x1b[33m-- Care Feedback --\x1b[0m");
  await testRoute({ name: "Feedback: valid", method: 'POST', url: '/api/agent/care/feedback', body: '{"phone":"9876543210","rating":"yes"}', expectedStatus: 200, mustContain: ['saved'] });
  await testRoute({ name: "Feedback: missing fields", method: 'POST', url: '/api/agent/care/feedback', body: '{"phone":""}', expectedStatus: 400, mustContain: ['error'] });

  console.log("\n\x1b[33m-- Voice Agent --\x1b[0m");
  await testRoute({ name: "Voice: POST parked (503)", method: 'POST', url: '/api/agent/voice', body: '{"transcript":"hello"}', expectedStatus: 503, mustContain: ['parked'] });
  await testRoute({ name: "Voice: GET status", method: 'GET', url: '/api/agent/voice', expectedStatus: 200, mustContain: ['parked'] });

  console.log("\n\x1b[33m-- Rate Limiting --\x1b[0m");
  let rlOk = true;
  for (let i = 1; i <= 8; i++) {
    await new Promise(r => {
      const req = http.request(BASE + '/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '11.0.0.1' } }, (res) => {
        if (i >= 6 && res.statusCode !== 429) rlOk = false;
        r();
      });
      req.write('{"type":"footer","phone":"5555555555"}');
      req.end();
    });
  }
  if (rlOk) {
    console.log("\x1b[32m  PASS  Rate limit (enquiry) kicks in after 5 reqs\x1b[0m");
    pass++;
  } else {
    console.log("\x1b[31m  FAIL  Rate limit (enquiry) did NOT trigger\x1b[0m");
    fail++;
    results.push({ test: 'Rate limit (enquiry)', result: 'FAIL', http: '200', notes: 'Expected 429 after 5 reqs' });
  }

  console.log("\n\x1b[33m-- Data Leak Scan (Error Paths) --\x1b[0m");
  await testRoute({ name: "Leak: malformed JSON", method: 'POST', url: '/api/enquiry', headers: ip(10), body: 'not json', expectedStatus: 400, mustContain: ['error'], mustNotContain: ['NOTION_TOKEN','node_modules','at Object'] });
  await testRoute({ name: "Leak: empty body to payment", method: 'POST', url: '/api/payment/create-order', body: '{}', expectedStatus: 503, mustNotContain: ['RAZORPAY_KEY_ID','RAZORPAY_KEY_SECRET'] });

  console.log("\n\x1b[36m=======================================================\x1b[0m");
  const color = fail === 0 ? "\x1b[32m" : "\x1b[31m";
  console.log(`${color}  RESULTS: ${pass} PASSED, ${fail} FAILED\x1b[0m`);
  console.log("\x1b[36m=======================================================\x1b[0m\n");

  if (fail > 0) {
    console.log("\x1b[31mFAILURES:\x1b[0m");
    console.table(results.filter(r => r.result === 'FAIL'));
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch(console.error);
