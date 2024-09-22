// app/api/shorten/route.js
import { NextResponse } from 'next/server';
import shortid from 'shortid';
import { connectToDatabase } from '../../../lib/mongodb';
import Url from '../../../models/Url';

export async function POST(request) {
  await connectToDatabase();

  const { longUrl } = await request.json();

  if (!longUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Check if the URL already exists in the database
  let url = await Url.findOne({ longUrl });
  if (url) {
    return NextResponse.json(url, { status: 200 });
  }

  // Generate a short URL code
  const shortUrlCode = shortid.generate();

  // Create and save the new shortened URL
  url = new Url({
    longUrl,
    shortUrl: shortUrlCode,
  });

  await url.save();

  return NextResponse.json({
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortUrlCode}`,
    longUrl,
  }, { status: 201 });
}
