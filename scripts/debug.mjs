import http from 'http';

function post(url, body) {
  return new Promise(resolve => {
    const req = http.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('--- Chat ---');
  console.log(await post('http://localhost:3000/api/agent/breezy', { messages: [{ id: "1", role: "user", content: "hi" }] }));

  console.log('--- B2B ---');
  console.log(await post('http://localhost:3000/api/enquiry', {
    type: "b2b",
    name: "B2B Test",
    phone: "9876543212",
    email: "corp@example.com",
    company: "Acme Corp",
    businessType: "Office",
    units: 20,
    issueType: "Annual contract"
  }));
}
run();
