import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const generateAIResponse = async (message: string): Promise<string> => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    };

    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    return aiResponse;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
};
