// app/api/[shortUrl]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import Url from '../../../models/Url';

export async function GET(req, { params }) {
  await connectToDatabase();

  const { shortUrl } = params;

  // Find the URL in the database by shortUrl code
  const url = await Url.findOne({ shortUrl });

  if (!url) {
    return NextResponse.json({ error: 'URL not found' }, { status: 404 });
  }

  // Increment the click count (optional)
  url.clicks++;
  await url.save();

  // Redirect to the original long URL
  return NextResponse.redirect(url.longUrl);
}
