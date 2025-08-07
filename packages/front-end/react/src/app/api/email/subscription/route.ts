import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, language = 'es' } = await request.json();

    // Validación básica
    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const notificationLink = process.env.NEXT_PUBLIC_NOTIFICATION_LINK || 'https://electa-demov-2-react.vercel.app';

    // Contenido del email según el idioma
    const emailContent = language === 'en' ? {
      subject: '✅ Subscription Confirmed - Electa Bolivia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            ✅ Subscription Confirmed - Electa Bolivia
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px;">
            <h3 style="color: #374151; margin-top: 0;">🎉 Welcome to Electa Bolivia!</h3>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for subscribing to our election alerts. You will now receive notifications about:
            </p>
            
            <ul style="color: #374151; line-height: 1.6; padding-left: 20px;">
              <li>🏆 Election winners</li>
              <li>📊 Important result changes</li>
              <li>🗳️ Key electoral events</li>
              <li>📈 Significant percentage updates</li>
            </ul>
            
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;">
                <strong>Your subscription is now active!</strong><br>
                Email: ${email}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${notificationLink}" 
                 style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Live Results
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>This email was sent from Electa Bolivia's election monitoring platform.</p>
              <p>Date: ${new Date().toLocaleString('en-US', { 
                timeZone: 'America/La_Paz',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </div>
      `
    } : {
      subject: '✅ Suscripción Confirmada - Electa Bolivia',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            ✅ Suscripción Confirmada - Electa Bolivia
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px;">
            <h3 style="color: #374151; margin-top: 0;">🎉 ¡Bienvenido a Electa Bolivia!</h3>
            
            <p style="color: #374151; line-height: 1.6;">
              Gracias por suscribirte a nuestras alertas electorales. Ahora recibirás notificaciones sobre:
            </p>
            
            <ul style="color: #374151; line-height: 1.6; padding-left: 20px;">
              <li>🏆 Ganadores electorales</li>
              <li>📊 Cambios importantes en resultados</li>
              <li>🗳️ Eventos electorales clave</li>
              <li>📈 Actualizaciones significativas de porcentajes</li>
            </ul>
            
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="margin: 0; color: #065f46;">
                <strong>¡Tu suscripción está ahora activa!</strong><br>
                Email: ${email}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${notificationLink}" 
                 style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Ver Resultados en Vivo
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>Este email fue enviado desde la plataforma de monitoreo electoral de Electa Bolivia.</p>
              <p>Fecha: ${new Date().toLocaleString('es-BO', { 
                timeZone: 'America/La_Paz',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </div>
      `
    };

    const { data, error } = await resend.emails.send({
      from: `Electa Bolivia <${fromEmail}>`,
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error('Error enviando email de suscripción:', error);
      return NextResponse.json(
        { error: 'Error al enviar el email de confirmación' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error en la API de suscripción:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
