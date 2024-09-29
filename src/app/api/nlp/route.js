import { analyzeSentiment } from '../../../services/nlpService';

export async function POST(request) {
  const { message } = await request.json();

  if (!message) {
    return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
  }

  try {
    const sentimentResult = await analyzeSentiment(message);
    return new Response(JSON.stringify(sentimentResult), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
