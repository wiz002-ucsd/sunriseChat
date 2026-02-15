const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');
const Joi = require('joi');
const ragService = require('./services/ragService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// Validation schemas
const messageSchema = Joi.object({
  message: Joi.string().min(1).max(2000).required(),
  conversationHistory: Joi.array().items(
    Joi.object({
      role: Joi.string().valid('user', 'assistant').required(),
      content: Joi.string().required()
    })
  ).max(50).optional().default([])
});

const documentSchema = Joi.object({
  title: Joi.string().min(1).max(500).required(),
  content: Joi.string().min(50).max(100000).required(),
  metadata: Joi.object().optional().default({})
});

// Safety keywords and phrases to monitor
const SAFETY_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'self-harm', 'cut myself',
  'overdose', 'poison', 'jump off', 'hang myself', 'hurt myself',
  'violence', 'harm others', 'attack', 'threaten', 'bomb', 'weapon'
];

const CRISIS_KEYWORDS = [
  'emergency', 'crisis', 'immediate help', 'right now', 'urgent',
  'can\'t cope', 'breaking down', 'losing control'
];

// Function to check message safety
function checkMessageSafety(message) {
  const lowerMessage = message.toLowerCase();
  
  const hasSafetyKeywords = SAFETY_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  const hasCrisisKeywords = CRISIS_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  return {
    isSafe: !hasSafetyKeywords,
    hasCrisisKeywords,
    flaggedKeywords: SAFETY_KEYWORDS.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    )
  };
}

// Function to generate empathetic system prompt with RAG context
function generateSystemPrompt(ragContext = '') {
  let prompt = `You are Sunrise Chat, a compassionate AI companion designed to provide emotional support and friendly conversation. 

User demographic: 12-17 years old, use youthful tone, language, and slang.
Pretend you are also a teenager, and you are a friend of the user.

Your role is to:
- Listen actively and respond with empathy and understanding
- Provide emotional support through kind, non-judgmental responses
- Offer gentle encouragement and positive perspectives
- Help users process their feelings in a healthy way
- Maintain a warm, caring, and professional tone. It is okay to be light-hearted and cheerful.

Important guidelines:
- Always prioritize the user's emotional wellbeing
- If someone mentions self-harm, suicide, or violence, respond with empathy while gently encouraging them to seek professional help
- Never provide medical advice, therapy, or diagnoses
- Keep responses conversational and supportive, not clinical
- Use "I" statements to show understanding ("I can hear how difficult this is for you")
- Avoid giving specific advice unless it's general wellbeing suggestions
- If conversations become concerning, acknowledge their pain while suggesting professional resources

Remember: You're here to listen, support, and provide a safe space for emotional expression.`;

  if (ragContext) {
    prompt += `\n\nRelevant Information from Knowledge Base:\n${ragContext}\n\nWhen appropriate, you can reference this information to provide more informed and helpful responses. However, always maintain your empathetic and supportive tone.`;
  }

  return prompt;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sunrise Chat API is running' });
});

app.post('/api/chat', async (req, res) => {
  try {
    // Validate input
    const { error, value } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Invalid input', 
        details: error.details[0].message 
      });
    }

    const { message, conversationHistory } = value;

    // Check message safety
    const safetyCheck = checkMessageSafety(message);
    
    if (!safetyCheck.isSafe) {
      // For safety concerns, provide immediate supportive response
      const safetyResponse = `I'm really concerned about what you're sharing with me. I want you to know that you're not alone, and there are people who can help you right now.

Please consider reaching out to:
- National Suicide Prevention Lifeline: 988 (24/7)
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911

Your life has value, and there are trained professionals who want to help you through this difficult time. Would you like to talk about what's making you feel this way in a safer way?`;

      return res.json({
        response: safetyResponse,
        isSafetyResponse: true,
        conversationHistory: [...conversationHistory, { role: 'user', content: message }]
      });
    }

    // Retrieve relevant context from knowledge base (RAG)
    let ragContext = '';
    try {
      const relevantChunks = await ragService.retrieveRelevantChunks(message, 3, 0.7);
      if (relevantChunks.length > 0) {
        ragContext = relevantChunks.map((chunk, index) => {
          return `[${index + 1}] From "${chunk.title}":\n${chunk.text}\n`;
        }).join('\n');
      }
    } catch (error) {
      console.error('Error retrieving RAG context:', error);
      // Continue without RAG context if there's an error
    }

    // Prepare conversation for OpenAI
    const systemPrompt = generateSystemPrompt(ragContext);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    let aiResponse;
    
    // Mock mode for testing (remove this when you have valid billing)
    if (process.env.MOCK_MODE === 'true') {
      aiResponse = "I'm here to listen and support you. I understand you're going through a difficult time, and I want you to know that your feelings are valid. While I can't replace professional help, I'm here to provide a safe space for you to express yourself. What's on your mind today?";
    } else {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.8,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      aiResponse = completion.choices[0].message.content;
    }

    // Update conversation history
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    ];

    res.json({
      response: aiResponse,
      isSafetyResponse: false,
      conversationHistory: updatedHistory,
      hasCrisisKeywords: safetyCheck.hasCrisisKeywords
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ 
        error: 'Service temporarily unavailable. Please try again later.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Something went wrong. Please try again.' 
    });
  }
});

// Document Management Endpoints

// Add a new document to the knowledge base
app.post('/api/documents', async (req, res) => {
  try {
    const { error, value } = documentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Invalid input',
        details: error.details[0].message
      });
    }

    const { title, content, metadata } = value;

    const result = await ragService.addDocument(title, content, metadata);

    res.json({
      success: true,
      documentId: result.documentId,
      chunks: result.chunks,
      message: `Document "${title}" added successfully with ${result.chunks} chunks`
    });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({
      error: 'Failed to add document',
      details: error.message
    });
  }
});

// Get all documents
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await ragService.getAllDocuments();
    res.json({
      success: true,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        metadata: doc.metadata,
        createdAt: doc.created_at
      }))
    });
  } catch (error) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({
      error: 'Failed to retrieve documents'
    });
  }
});

// Delete a document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ragService.deleteDocument(id);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Document deleted successfully'
      });
    } else {
      res.status(404).json({
        error: 'Document not found'
      });
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      error: 'Failed to delete document'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Sunrise Chat server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

