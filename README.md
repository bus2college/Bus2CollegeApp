# Bus2College - AI-Enabled College Application Assistant

Bus2College is a web application designed to help high school students manage their college applications with AI-powered assistance.

## Features

- **Secure Authentication**: Login/Registration system
- **Three-Panel Interface**: 
  - Left: Navigation menu (7 sections)
  - Center: Content display area
  - Right: AI chat assistant
- **College Application Tracking**: Manage colleges, essays, activities, recommenders, and admission status
- **AI Assistant**: Real-time help with essay writing and college application questions

## Setup Instructions

1. **Logo**: The Bus2College logo is already in place at `assets/bus2college.png`
2. **API Key**: Create `js/config.js` with your Anthropic Claude API key:
   ```javascript
   const CONFIG = {
       CLAUDE_API_KEY: 'your-api-key-here'
   };
   ```
3. **Open**: Launch `index.html` in a web browser

## Project Structure

```
bus2college/
├── index.html          # Login/Registration page
├── home.html           # Main application interface
├── css/
│   └── styles.css      # Application styles
├── js/
│   ├── auth.js         # Authentication logic
│   ├── navigation.js   # Page navigation
│   ├── ai-chat.js      # AI assistant integration
│   ├── data-handler.js # Excel data operations
│   └── config.js       # API keys (git-ignored)
├── assets/
│   └── bus2college.png    # Bus2College logo
└── data/               # Excel spreadsheets for data storage
    ├── users.xlsx
    ├── colleges.xlsx
    ├── common_app_essay.xlsx
    ├── supplemental_essays.xlsx
    ├── activities.xlsx
    ├── recommenders.xlsx
    ├── daily_tracker.xlsx
    └── admissions_status.xlsx
```

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- SheetJS (xlsx.js) for Excel file handling
- Anthropic Claude API for AI assistance
- LocalStorage for session management

## Development Notes

- This is a rapid prototype using frontend-only architecture
- Data is stored in Excel files in the `data/` folder
- Ready for deployment to public domain when finalized

## Color Scheme

- Navy Blue: #002855 (primary)
- Yellow: #FFD700 (accent)
- Orange: #C8511F (secondary)
