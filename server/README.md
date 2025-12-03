# Bus2College Backend API

This is the backend server for the Bus2College application, providing RESTful APIs for college search, deadline management, AI-powered recommendations, and more.

## Features

- **College Data Management**: Search and filter 200+ US colleges
- **Real-time Deadlines**: Fetch current application deadlines with urgency indicators
- **AI-Powered Recommendations**: Claude API integration for personalized suggestions
- **Advanced Search**: Multi-criteria college search with matching algorithms
- **Essay Review**: AI-powered college essay feedback
- **Caching**: Built-in caching for improved performance

## Tech Stack

- Node.js 16+
- Express.js 4.18.2
- Anthropic Claude API
- Axios for HTTP requests
- Cheerio for web scraping
- Node-cache for in-memory caching

## Installation

1. **Install Dependencies**
```bash
cd server
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
```

Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

3. **Start the Server**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Colleges

- `GET /api/colleges` - Get all colleges with optional filters
  - Query params: `state`, `search`, `limit`
- `GET /api/colleges/by-name/:name` - Get college by name
- `GET /api/colleges/by-state/:state` - Get colleges by state
- `GET /api/colleges/details/:name` - Get detailed college info
- `GET /api/colleges/autocomplete?q=query` - Autocomplete search

### Deadlines

- `GET /api/deadlines/:collegeName` - Get deadline for specific college
- `POST /api/deadlines/batch` - Get batch deadlines
  - Body: `{ "colleges": ["College1", "College2"] }`
- `GET /api/deadlines/upcoming?days=60` - Get upcoming deadlines
- `GET /api/deadlines/type/:type` - Get deadlines by type (early/regular/rolling)

### Search

- `POST /api/search/colleges` - Advanced college search
  - Body: See Search Criteria below
- `POST /api/search/recommendations` - Get personalized recommendations
  - Body: Student profile (GPA, test scores, preferences)
- `GET /api/search/quick?q=query` - Quick search with autocomplete

### AI Features

- `POST /api/ai/suggestions` - Get AI college suggestions
  - Body: Student profile
- `POST /api/ai/chat` - Chat with AI counselor
  - Body: `{ "message": "...", "history": [] }`
- `POST /api/ai/essay/review` - Review college essay
  - Body: `{ "essay": "...", "prompt": "...", "collegeName": "..." }`

## Search Criteria Example

```json
{
  "keyword": "engineering",
  "state": "CA",
  "minAcceptance": 10,
  "maxAcceptance": 50,
  "satScore": 1400,
  "type": "Public",
  "sortBy": "acceptance",
  "sortOrder": "asc",
  "page": 1,
  "limit": 20
}
```

## Student Profile Example

```json
{
  "gpa": 3.8,
  "testScore": 1450,
  "testType": "SAT",
  "interests": "Computer Science, Mathematics",
  "statePreference": "no-preference",
  "state": "WA"
}
```

## Caching Strategy

- College data: 24-hour cache
- Deadline data: 1-hour cache
- Search results: Not cached (dynamic)
- AI responses: Not cached (unique)

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message here"
}
```

## CORS Configuration

Configure allowed origins in `.env`:
```
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

## Rate Limiting

Default: 100 requests per 15 minutes per IP
Configure in `.env` if needed.

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication & authorization
- [ ] Persistent application tracking
- [ ] Real-time web scraping for deadlines
- [ ] College Board API integration
- [ ] Email notifications for deadlines
- [ ] Social features (forums, mentorship)

## Development

Run tests (when implemented):
```bash
npm test
```

Lint code:
```bash
npm run lint
```

## Deployment

For production deployment:
1. Set `NODE_ENV=production` in `.env`
2. Configure production database
3. Set up HTTPS/SSL
4. Use process manager (PM2, systemd)
5. Configure reverse proxy (Nginx)
6. Enable rate limiting and security headers

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
