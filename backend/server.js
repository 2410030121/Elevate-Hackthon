const http = require('http');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([
    {id:"CP-1042", title:"Open manhole near community park", category:"Open Manhole", priority:"EMERGENCY", status:"In Progress", lat:17.4522, lng:78.3911, time:"2 min ago", description:"Large uncovered manhole on the roadside.", reporter:"Citizen", emergency:true},
    {id:"CP-1041", title:"Broken streetlight on 4th Avenue", category:"Streetlight", priority:"HIGH", status:"Assigned", lat:17.4485, lng:78.3877, time:"18 min ago", description:"Streetlight is not working after sunset.", reporter:"Citizen", emergency:false}
  ], null, 2));
}

const getComplaints = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const saveComplaints = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const server = http.createServer((req, res) => {
  // Setup CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ service: 'SocioSolve Node API', status: 'UP' }));
    return;
  }

  if (url.pathname === '/api/complaints') {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(getComplaints()));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk.toString());
      req.on('end', () => {
        try {
          const complaints = getComplaints();
          const c = JSON.parse(body);
          c.id = "CP-" + (1043 + complaints.length);
          if (!c.status) c.status = "Submitted";
          complaints.push(c);
          saveComplaints(complaints);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(c));
        } catch(e) {
          res.writeHead(400); res.end();
        }
      });
      return;
    }
  }

  // Handle PATCH like /api/complaints/CP-1042/status?value=Resolved
  if (req.method === 'PATCH' && url.pathname.startsWith('/api/complaints/') && url.pathname.endsWith('/status')) {
    const id = url.pathname.split('/')[3];
    const value = url.searchParams.get('value');
    const domain = url.searchParams.get('domain');
    const complaints = getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    
    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }
    
    if (value) complaints[index].status = value;
    if (domain !== null && domain !== undefined) complaints[index].domain = domain;
    saveComplaints(complaints);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(complaints[index]));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Route not found' }));
});

const PORT = 9000;
server.listen(PORT, () => {
  console.log(`Node.js Backend Server running on http://localhost:${PORT}`);
  console.log(`Database is saved to ${DB_FILE}`);
});
