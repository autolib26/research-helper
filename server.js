require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/api/research', async (req, res) => {
  const { topic, grade } = req.body;

  if (!topic || !grade) {
    return res.status(400).json({ error: 'Missing topic or grade' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in .env file' });
  }

  const gradeDesc =
    grade <= 2 ? 'early elementary (grades 1-2), use very simple words' :
    grade <= 4 ? 'elementary (grades 3-4), use simple words' :
    grade <= 6 ? 'upper elementary (grades 5-6), use moderate vocabulary' :
                 'middle school (grades 7-8), can use advanced vocabulary';

  const systemPrompt = `You are a helpful research assistant for grade school children. You ONLY respond with valid JSON. No markdown fences, no extra text — just the raw JSON object.`;

  const userPrompt = `A grade ${grade} student (${gradeDesc}) wants to research: "${topic}"

Return ONLY a raw JSON object in exactly this shape:
{
  "safeTopicCheck": true,
  "funFact": "One fascinating age-appropriate fact in 1-2 sentences",
  "ideas": [
    { "icon": "🦕", "title": "Short idea title", "description": "1-2 sentence description" }
  ],
  "questions": ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]
}

Rules:
- safeTopicCheck must be false if the topic is inappropriate for children; otherwise true
- Provide exactly 6 items in the ideas array
- Provide exactly 5 items in the questions array
- NO URLs or website links anywhere
- All content must be age-appropriate for grade ${grade}
- If safeTopicCheck is false, set ideas and questions to empty arrays and funFact to ""`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: 'Anthropic API error: ' + errText });
    }

    const data = await response.json();
    const text = (data.content || []).map(i => i.text || '').join('').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error('Could not parse JSON from Claude response');
    }

    res.json(parsed);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Research Helper running at http://localhost:${PORT}`);
});
