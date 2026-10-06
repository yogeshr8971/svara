import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

/**
 * Validates whether an image shows a single full-body standing person.
 * Uses Gemini 3.8 Flash for vision analysis.
 *
 * @param {Buffer} imageBuffer - The raw image buffer
 * @param {string} mimeType - 'image/jpeg' | 'image/png' | 'image/webp'
 * @returns {{ valid: boolean, confidence: number, reason: string, issues: string[] }}
 */
export const validateAvatar = async (imageBuffer, mimeType = 'image/jpeg') => {
  try {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `You are a photo validator for a virtual try-on fashion application.
Analyze this image and determine if it shows a single person standing upright with their full body visible (from head to feet).

Return ONLY a valid JSON object with exactly this structure (no markdown, no extra text):
{
  "valid": boolean,
  "confidence": number between 0 and 1,
  "reason": "one clear sentence explanation",
  "issues": ["array", "of", "issue", "codes"]
}

Valid issue codes to use (only include relevant ones):
feet_not_visible, body_cropped, multiple_people, lying_down, sitting, face_not_visible, image_too_dark, image_too_blurry, non_human, no_person_detected, obstructed_view, partial_body

Rules for valid=true:
- Exactly ONE person visible
- Person is STANDING upright
- Full body visible from HEAD to FEET
- Feet clearly visible
- Face clearly visible
- Reasonable lighting (not pitch dark)
- Reasonable clarity (not severely blurry)
- Person is not heavily obstructed`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          { inlineData: { mimeType, data: imageBuffer.toString('base64') } }
        ]
      }]
    });
    const text = response.candidates[0].content.parts[0].text.trim();

    // Extract JSON from response (handle any wrapping text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error('Avatar validation error:', err.message);
    return {
      valid: false,
      confidence: 0,
      reason: 'Validation service encountered an error. Please try again.',
      issues: ['validation_error'],
    };
  }
};
