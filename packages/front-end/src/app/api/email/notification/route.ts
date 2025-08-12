import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Verificar que RESEND_API_KEY esté configurado
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurado');
      return NextResponse.json(
        { error: 'Configuración de email no disponible' },
        { status: 500 }
      );
    }

    const { email, language = 'es' } = await request.json();

    console.log('Datos recibidos en notification endpoint:', { email, language });

    // Validación básica
    if (!email) {
      console.error('Email faltante:', { email });
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Email inválido:', email);
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const notificationLink = process.env.NEXT_PUBLIC_NOTIFICATION_LINK || 'https://electa-demov-2-react.vercel.app';
    
    // En modo testing, solo enviar a emails verificados
    const isTesting = process.env.NODE_ENV === 'development';
    const allowedTestEmails = ['electa.desk@gmail.com']; // Emails permitidos en testing
    
    if (isTesting && !allowedTestEmails.includes(email)) {
      console.log(`[Testing Mode] Email no permitido: ${email}. Solo se permiten: ${allowedTestEmails.join(', ')}`);
      return NextResponse.json(
        { error: 'En modo testing solo se permiten emails específicos' },
        { status: 400 }
      );
    }

    // Contenido del email genérico
    const emailContent = language === 'en' ? {
      subject: `🔔 Electoral Update Alert - Electa Bolivia`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            🔔 Electoral Update Alert - Electa Bolivia
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px;">
            <h3 style="color: #374151; margin-top: 0;">📊 New Electoral Event!</h3>
            
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h4 style="color: #065f46; margin: 0 0 10px 0;">Important Update:</h4>
              <p style="margin: 5px 0; color: #374151;">
                There has been a significant development in the electoral process. 
                Click the link below to see the latest updates and detailed information.
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              The electoral results have been updated with new information. 
              Visit our platform to see the complete results and detailed analysis.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${notificationLink}" 
                 style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                View Latest Results
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>This notification was sent from Electa Bolivia's election monitoring platform.</p>
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
      subject: `🔔 Alerta de Actualización Electoral - Electa Bolivia`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
            🔔 Alerta de Actualización Electoral - Electa Bolivia
          </h2>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px;">
            <h3 style="color: #374151; margin-top: 0;">📊 ¡Nuevo Evento Electoral!</h3>
            
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h4 style="color: #065f46; margin: 0 0 10px 0;">Actualización Importante:</h4>
              <p style="margin: 5px 0; color: #374151;">
                Ha habido un desarrollo significativo en el proceso electoral. 
                Haz clic en el enlace de abajo para ver las últimas actualizaciones e información detallada.
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              Los resultados electorales han sido actualizados con nueva información. 
              Visita nuestra plataforma para ver los resultados completos y el análisis detallado.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${notificationLink}" 
                 style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Ver Últimos Resultados
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
              <p>Esta notificación fue enviada desde la plataforma de monitoreo electoral de Electa Bolivia.</p>
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

    console.log('Intentando enviar email genérico con Resend:', {
      from: `Electa Bolivia <${fromEmail}>`,
      to: [email],
      subject: emailContent.subject,
      hasHtml: !!emailContent.html
    });

    const { data, error } = await resend.emails.send({
      from: `Electa Bolivia <${fromEmail}>`,
      to: [email],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    if (error) {
      console.error('Error enviando email genérico:', error);
      return NextResponse.json(
        { error: `Error al enviar el email de notificación: ${error.message || 'Error desconocido'}` },
        { status: 500 }
      );
    }

    console.log('Email genérico enviado exitosamente:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error en la API de notificación genérica:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
