import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
  
  try {
    const body = await request.json();
    const { url } = body;


    const validUrl = url.startsWith('http') ? url : `https://${url}`;
    const shortcode = Math.random().toString(36).substring(2, 8);


    const client = await clientPromise;
    
    const db = client.db('urlshortener');
    const collection = db.collection('urls');

    const doc = {
      shortcode,
      originalUrl: validUrl,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(doc);


    return NextResponse.json({ message: 'Success', data: shortcode }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error creating short URL', 
      error: String(error) 
    }, { status: 500 });
  }
}