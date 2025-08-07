import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    
    // Simulación de autenticación exitosa
    const sessionCookie = 'simulated-session-cookie-' + Date.now();
    const expiresIn = 60 * 60 * 24 * 5; // 5 días en segundos
    
    return NextResponse.json(
      { message: 'Authenticated successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': `session=${sessionCookie}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${expiresIn}`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid authentication' },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    return NextResponse.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': `session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Error logging out' },
      { status: 500 }
    );
  }
}