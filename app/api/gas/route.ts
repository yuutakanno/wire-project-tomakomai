// app/api/gas/route.ts
import { NextResponse } from 'next/server';

const GAS_API_URL = 'https://script.google.com/macros/s/AKfycbyfYM8q6t7Q7UwIRORFBNOCA-mMpVFE1Z3oLzCJp5GNiYI9_CMy4767p9am2iMY70kl/exec';

export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(GAS_API_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function GET() {
  const res = await fetch(GAS_API_URL);
  const data = await res.json();
  return NextResponse.json(data);
}
