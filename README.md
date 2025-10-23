# Sunrise Chat 🌅

A compassionate ChatGPT wrapper app designed for emotional support with built-in safety mechanisms. This application provides a friendly, empathetic chatbot interface while maintaining safety protocols for sensitive topics.

## Features

- **Emotional Support Chatbot**: Powered by OpenAI's GPT-3.5-turbo with empathetic conversation capabilities
- **Safety Mechanisms**: Built-in content filtering and crisis intervention protocols
- **Beautiful UI**: Modern, responsive React interface with smooth animations
- **Rate Limiting**: Protection against API abuse
- **Crisis Detection**: Automatic detection of self-harm or crisis-related content
- **Professional Resources**: Automatic provision of crisis helpline information when needed

## Safety Features

The app includes comprehensive safety mechanisms:

- **Content Filtering**: Monitors for self-harm, suicide, and violence-related keywords
- **Crisis Intervention**: Provides immediate support resources when crisis keywords are detected
- **Professional Guidance**: Encourages users to seek professional help when appropriate
- **Rate Limiting**: Prevents API abuse and ensures fair usage

## Project Structure

```
sunriseChat/
├── backend/                 # Node.js/Express API server
│   ├── server.js           # Main server file with OpenAI integration
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables template
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main App component
│   │   └── index.js        # Entry point
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json for scripts
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd sunriseChat
   npm run install-all
   ```

2. **Set up environment variables:**
   ```bash
   cp backend/env.example backend/.env
   ```
   
   Edit `backend/.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend React app on http://localhost:3000

### Individual Commands

- **Start both servers:** `npm run dev`
- **Start backend only:** `npm run server`
- **Start frontend only:** `npm run client`

## API Endpoints

### `GET /api/health`
Health check endpoint.

### `POST /api/chat`
Main chat endpoint.

**Request Body:**
```json
{
  "message": "Hello, I'm feeling sad today",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant", 
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "response": "I'm sorry to hear you're feeling sad...",
  "isSafetyResponse": false,
  "conversationHistory": [...],
  "hasCrisisKeywords": false
}
```

## Safety Mechanisms

### Content Filtering
The app monitors for:
- Self-harm keywords (suicide, self-harm, etc.)
- Violence-related content
- Crisis indicators (emergency, urgent help needed)

### Crisis Response
When concerning content is detected:
1. Immediate supportive response is provided
2. Crisis helpline information is shared
3. Professional resource recommendations are given

### Rate Limiting
- 100 requests per 15-minute window per IP
- Prevents API abuse and ensures fair usage

## Development

### Adding New Safety Keywords
Edit the `SAFETY_KEYWORDS` and `CRISIS_KEYWORDS` arrays in `backend/server.js`:

```javascript
const SAFETY_KEYWORDS = [
  'suicide', 'kill myself', 'end my life',
  // Add new keywords here
];
```

### Customizing the System Prompt
Modify the `generateSystemPrompt()` function in `backend/server.js` to adjust the AI's behavior and responses.

## Deployment

### Environment Variables for Production
```bash
OPENAI_API_KEY=your_production_api_key
PORT=5000
NODE_ENV=production
```

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Production
```bash
cd backend
npm start
```

## Important Notes

⚠️ **This is an MVP for emotional support and should not replace professional mental health services.**

- Always encourage users to seek professional help for serious mental health concerns
- The app provides supportive conversation, not therapy or medical advice
- Crisis situations should be directed to appropriate emergency services

## Crisis Resources

If you or someone you know is in crisis:
- **National Suicide Prevention Lifeline:** 988 (24/7)
- **Crisis Text Line:** Text HOME to 741741
- **Emergency Services:** 911

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ for emotional support and mental wellbeing. 
