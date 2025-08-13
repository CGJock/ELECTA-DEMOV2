import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Configurado' : 'No configurado',
      FROM_EMAIL: process.env.FROM_EMAIL || 'No configurado',
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'No configurado',
      NODE_ENV: process.env.NODE_ENV || 'No configurado',
    };

    return NextResponse.json({ 
      success: true, 
      envVars,
      message: 'Variables de entorno verificadas'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al verificar variables de entorno' },
      { status: 500 }
    );
  }
}
