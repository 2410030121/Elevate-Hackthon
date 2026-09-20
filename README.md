# CivicPulse — Complete Hackathon Starter

A polished, hackathon-ready UI + Spring Boot API starter based on the uploaded PRISMTECH Round 2 PPT.

## Included features

### Citizen side
- Attractive responsive dashboard
- Report civic issue
- Photo upload preview
- GPS capture
- AI-assisted category + priority suggestion
- Emergency Safety Mode
- Offline-first local queue using browser Local Storage
- Automatic online/offline status
- Risk map visualization
- Nearby emergency warning center
- Complaint tracking and resolution timeline

### Authority side
- Command Center dashboard
- Emergency/high-priority queue
- Status updates: Submitted → Assigned → In Progress → Resolved
- Risk map
- AI assistance notice with human/admin control
- Live-style operational statistics

### Technology alignment
The PPT specifies React.js for citizen/authority screens, Spring Boot REST APIs, MySQL, Python + Scikit-learn, GPS + Maps, Firebase FCM, and IndexedDB/Local Storage.

This package implements the React UI, offline workflow, GPS capture, AI-assistance demo, emergency priority workflow and a Spring Boot API starter. Firebase and MySQL credentials are deliberately not hard-coded.

## Fastest demo

You only need Node.js 18+.

```bat
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite (normally http://localhost:5173).

For a hackathon demo, this is enough to show the full UI and workflows.

## Run backend too

Open another CMD:

```bat
cd backend
mvnw.cmd spring-boot:run
```

API:
`http://localhost:8080/api/health`

## Important demo flows

### Emergency
1. Report Issue
2. Type: "There is an open manhole near the park"
3. AI suggests Open Manhole + EMERGENCY
4. Capture GPS
5. Submit
6. Open Risk Map / Safety Alerts
7. Switch to Authority and open Command Center

### Offline
1. Turn off Wi-Fi/mobile internet or use browser DevTools Network → Offline.
2. Submit a report.
3. UI shows OFFLINE QUEUE.
4. Report is stored in Local Storage.
5. Restore internet.
6. Use "Sync queue" to demonstrate the synchronization workflow.

### Authority
1. Switch Citizen → Authority.
2. Open Command Center.
3. Change report status from the dropdown.
4. Open Risk Map.

## Firebase FCM

See:
`frontend/public/README-FCM.md`

The UI works without Firebase credentials. For production, connect Firebase Cloud Messaging and store device tokens on the backend.

## MySQL

The uploaded PPT specifies MySQL as the database. For a production build, add:
- Spring Data JPA
- MySQL Connector/J
- Complaint/User entities
- repositories
- persistent offline sync endpoint
- Firebase token table

## Folder structure

```
CivicPulse_Complete/
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── public/
│   └── package.json
├── backend/
│   ├── pom.xml
│   └── src/
└── README.md
```
