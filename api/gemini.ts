export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, base64, mimeType } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const parts = base64
    ? [{ inline_data: { mime_type: mimeType, data: base64 } }, { text: prompt }]
    : [{ text: prompt }];

  const geminiRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] }),
  });

  if (!geminiRes.ok) {
    return res.status(geminiRes.status).json({ error: 'Gemini API error' });
  }

  const data = await geminiRes.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return res.status(200).json({ text });
}
