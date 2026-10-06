import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

// ─── Provider Implementations ────────────────────────────────────────────────

class GeminiProvider {
  async generate({ personImageUrl, garmentImageUrl }) {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim().replace(/^["']|["']$/g, '');
    const ai = new GoogleGenAI({ apiKey });

    const [personBase64, garmentBase64] = await Promise.all([
      fetchImageAsBase64(personImageUrl),
      fetchImageAsBase64(garmentImageUrl),
    ]);

    const prompt = "Virtual try-on: Take the person from the first image and have them wear the garment from the second image. Generate a realistic photorealistic image of the person wearing this clothing.";

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-image',
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: personBase64 } },
            { inlineData: { mimeType: 'image/jpeg', data: garmentBase64 } }
          ]
        }],
        config: {
          responseModalities: ['IMAGE']
        }
      });
    } catch (err) {
      console.warn('gemini-2.5-flash-image attempt failed, trying gemini-3.1-flash-image:', err.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'image/jpeg', data: personBase64 } },
            { inlineData: { mimeType: 'image/jpeg', data: garmentBase64 } }
          ]
        }],
        config: {
          responseModalities: ['IMAGE']
        }
      });
    }

    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const imagePart = parts.find(p => p.inlineData);

    if (imagePart && imagePart.inlineData?.data) {
      return {
        type: 'image',
        imageBuffer: Buffer.from(imagePart.inlineData.data, 'base64'),
        mimeType: imagePart.inlineData.mimeType || 'image/png',
        styleData: null,
      };
    }

    console.error('Gemini image generation candidate failure:', {
      finishReason: candidate?.finishReason,
      safetyRatings: candidate?.safetyRatings,
      partsCount: parts.length,
      keys: parts.map(p => Object.keys(p))
    });

    throw new Error('AI try-on did not produce an image. Please try again.');
  }
}

class FASHNProvider {
  async generate({ personImageUrl, garmentImageUrl }) {
    if (!process.env.FASHN_API_KEY) {
      throw new Error('FASHN API key not configured. Set FASHN_API_KEY in .env or switch VTO_PROVIDER=gemini.');
    }

    const modelName = process.env.FASHN_MODEL || 'tryon-max';
    const inputs = {
      model_image: personImageUrl,
      ...(modelName === 'tryon-max'
        ? { product_image: garmentImageUrl }
        : { garment_image: garmentImageUrl, category: 'auto' }),
    };

    const response = await fetch('https://api.fashn.ai/v1/run', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_name: modelName,
        inputs,
      }),
    });

    if (!response.ok) {
      throw new Error(`FASHN could not start the try-on request (${response.status}).`);
    }

    const data = await response.json();
    if (!data?.id) throw new Error('FASHN did not return a generation ID.');

    const pollUrl = `https://api.fashn.ai/v1/status/${data.id}`;
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const poll = await fetch(pollUrl, {
        headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY}` },
      });
      const pollData = await poll.json();
      if (pollData.status === 'completed') {
        const outputUrl = pollData.output?.[0];
        if (!outputUrl) throw new Error('FASHN completed without returning an image.');

        const imgBase64 = await fetchImageAsBase64(outputUrl);
        return {
          type: 'image',
          imageBuffer: Buffer.from(imgBase64, 'base64'),
          mimeType: 'image/jpeg',
          styleData: null,
        };
      }
      if (['failed', 'canceled', 'timed_out'].includes(pollData.status)) {
        throw new Error('FASHN could not create this try-on image.');
      }
    }
    throw new Error('FASHN generation timed out after 90 seconds.');
  }
}

class FalProvider {
  async generate({ personImageUrl, garmentImageUrl }) {
    throw new Error('Fal provider not configured. Set VTO_PROVIDER=gemini or configure FAL_KEY.');
  }
}

// ─── Provider Registry ────────────────────────────────────────────────────────

const providers = {
  gemini: new GeminiProvider(),
  fashn: new FASHNProvider(),
  fal: new FalProvider(),
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a virtual try-on result.
 * Provider selected via VTO_PROVIDER env var (default: gemini).
 *
 * Returns:
 *   type: 'image' | 'style_description'
 *   imageBuffer?: Buffer
 *   mimeType?: string
 *   styleData?: object  (for style_description type)
 */
export const generateTryOn = async ({ personImageUrl, garmentImageUrl, options = {} }) => {
  const providerName = (process.env.VTO_PROVIDER || 'gemini').toLowerCase();
  const provider = providers[providerName];
  if (!provider) throw new Error(`Unknown VTO provider: "${providerName}". Use: gemini, fashn, or fal.`);
  return provider.generate({ personImageUrl, garmentImageUrl, options });
};

// ─── Helper ───────────────────────────────────────────────────────────────────

async function fetchImageAsBase64(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image from ${url}: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}
