import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check - you can add database connectivity checks here later
    return NextResponse.json(
      { 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'CryptoAlert Baby',
        version: '1.0.0'
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'ERROR', 
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    );
  }
}