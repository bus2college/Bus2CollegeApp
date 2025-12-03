# Bus2College API - Quick Reference

## 🚀 Base URL
```
http://localhost:3000
```

## 📚 Colleges

### Get All Colleges
```
GET /api/colleges
Query: ?state=WA&search=engineering&limit=10
```

### Get College by Name
```
GET /api/colleges/by-name/Harvard University
```

### Get Colleges by State
```
GET /api/colleges/by-state/CA
```

### College Details
```
GET /api/colleges/details/Stanford University
```

### Autocomplete
```
GET /api/colleges/autocomplete?q=harv
```

## ⏰ Deadlines

### Get Deadline
```
GET /api/deadlines/Yale University
```

### Batch Deadlines
```
POST /api/deadlines/batch
Body: {"colleges": ["Harvard University", "MIT"]}
```

### Upcoming Deadlines
```
GET /api/deadlines/upcoming?days=60
```

### Deadlines by Type
```
GET /api/deadlines/type/early
Types: early, regular, rolling
```

## 🔍 Search

### Advanced Search
```
POST /api/search/colleges
Body: {
  "keyword": "engineering",
  "state": "CA",
  "minAcceptance": 10,
  "maxAcceptance": 50,
  "satScore": 1400,
  "sortBy": "acceptance"
}
```

### Get Recommendations
```
POST /api/search/recommendations
Body: {
  "gpa": 3.8,
  "testScore": 1450,
  "testType": "SAT",
  "interests": "Computer Science",
  "statePreference": "no-preference"
}
```

### Quick Search
```
GET /api/search/quick?q=stanford
```

## 🤖 AI Features

### College Suggestions
```
POST /api/ai/suggestions
Body: {
  "gpa": 3.8,
  "testScore": 1450,
  "testType": "SAT",
  "interests": "Engineering",
  "statePreference": "no-preference"
}
```

### AI Chat
```
POST /api/ai/chat
Body: {
  "message": "What should I write about?",
  "history": []
}
```

### Essay Review
```
POST /api/ai/essay/review
Body: {
  "essay": "My essay text...",
  "prompt": "Describe a challenge...",
  "collegeName": "Harvard",
  "wordLimit": 650
}
```

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": {...},
  "total": 50,
  "page": 1
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🔑 Environment Setup

1. Create `.env` file:
```bash
ANTHROPIC_API_KEY=your_key_here
PORT=3000
NODE_ENV=development
```

2. Start server:
```bash
npm start
```

## 🧪 Testing Examples (PowerShell)

### Get Colleges
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/colleges"
```

### Get by State
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/colleges/by-state/WA"
```

### Post AI Suggestions
```powershell
$body = @{gpa=3.8; testScore=1450; testType="SAT"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/ai/suggestions" -Method Post -Body $body -ContentType "application/json"
```

## 📞 Support

- Documentation: See `server/README.md`
- Setup Guide: See `BACKEND_SETUP.md`
- Implementation: See `BACKEND_IMPLEMENTATION_SUMMARY.md`
