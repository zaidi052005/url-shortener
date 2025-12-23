import { NextResponse } from "next/server";
import clientPromise from '../../lib/mongodb';

export async function GET(
  request: Request,
  context: { params: Promise<{ shortcode: string }> }
) {
  try {
    const { shortcode } = await context.params;

    console.log('=== REDIRECT API ===');
    console.log('Looking up shortcode:', shortcode);

    const client = await clientPromise;
    const db = client.db('urlshortener');
    const collection = db.collection('urls');

    const result = await collection.findOne({ shortcode });

    console.log('MongoDB result:', result);

    if (result && result.originalUrl) {
      console.log('Redirecting to:', result.originalUrl);
      console.log('===================');
      return NextResponse.redirect(result.originalUrl, 307);
    }
    
    console.log('URL not found in database');
    console.log('===================');
    return new NextResponse('URL not found', { status: 404 });
  } catch (error) {
    console.error('Error fetching URL:', error);
    return new NextResponse('Error fetching URL: ' + String(error), { status: 500 });
  }
}