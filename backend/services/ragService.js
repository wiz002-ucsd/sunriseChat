const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Split text into chunks
function chunkText(text, chunkSize = 1000, overlap = 200) {
  if (!text || text.length === 0) return [];

  const chunks = [];
  const sentences = text.split(/[.!?]+\s+/);

  let currentChunk = '';
  for (const sentence of sentences) {
    const sentenceWithSpace = currentChunk ? ' ' + sentence : sentence;
    if ((currentChunk + sentenceWithSpace).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      // Overlap: keep last part of previous chunk
      const words = currentChunk.split(/\s+/);
      const overlapWords = Math.max(1, Math.floor(overlap / 10));
      currentChunk = words.slice(-overlapWords).join(' ') + sentenceWithSpace;
    } else {
      currentChunk += sentenceWithSpace;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter(chunk => chunk.length > 50);
}

// Generate embeddings for text
async function generateEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

// Add a new document
async function addDocument(title, content, metadata = {}) {
  // Insert document
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert({ title, content, metadata })
    .select('id')
    .single();

  if (docError) throw docError;

  const documentId = doc.id;
  const chunks = chunkText(content);
  console.log(`Processing document "${title}" - ${chunks.length} chunks`);

  // Process and insert each chunk with its embedding
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await generateEmbedding(chunks[i]);

    const { error: chunkError } = await supabase
      .from('document_chunks')
      .insert({
        document_id: documentId,
        chunk_index: i,
        chunk_text: chunks[i],
        embedding: JSON.stringify(embedding),
      });

    if (chunkError) {
      console.error(`Error inserting chunk ${i}:`, chunkError);
    }

    // Small delay to avoid rate limits
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return { documentId, chunks: chunks.length };
}

// Retrieve relevant chunks using vector similarity search
async function retrieveRelevantChunks(query, topK = 3, similarityThreshold = 0.7) {
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await supabase.rpc('match_chunks', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_threshold: similarityThreshold,
    match_count: topK,
  });

  if (error) {
    console.error('Error retrieving relevant chunks:', error);
    return [];
  }

  return (data || []).map(row => ({
    text: row.chunk_text,
    title: row.title,
    documentId: row.document_id,
    similarity: row.similarity,
    metadata: row.metadata,
  }));
}

// Get all documents
async function getAllDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, metadata, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading documents:', error);
    return [];
  }

  return data || [];
}

// Delete a document (chunks cascade automatically)
async function deleteDocument(documentId) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    console.error('Error deleting document:', error);
    throw error;
  }

  return { success: true };
}

module.exports = {
  addDocument,
  retrieveRelevantChunks,
  getAllDocuments,
  deleteDocument,
};
