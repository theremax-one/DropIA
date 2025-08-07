import nodemailer from 'nodemailer';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

// Configuración del transportador de email (para desarrollo)
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER || 'tu-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'tu-password-de-app',
  },
});

// Para desarrollo, usar un transportador de prueba
const createTestAccount = async () => {
  if (process.env.NODE_ENV === 'development') {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  return transporter;
};

export const sendEmail = async (emailData: EmailData) => {
  try {
    const emailTransporter = await createTestAccount();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@dropia.com',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      attachments: emailData.attachments,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    
    console.log('Email enviado:', info.messageId);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('URL de vista previa:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

export const sendInvoiceEmail = async (
  userEmail: string,
  userName: string,
  invoiceData: {
    invoiceNumber: string;
    productName: string;
    price: number;
    purchaseDate: Date;
    productId: string;
  },
  invoiceHtml: string
) => {
  const subject = `Factura DropIA - ${invoiceData.invoiceNumber}`;
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Factura DropIA</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .invoice-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .product-info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .total { font-size: 18px; font-weight: bold; color: #2c5aa0; text-align: right; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ¡Gracias por tu compra!</h1>
          <p>Tu factura está lista</p>
        </div>
        
        <div class="content">
          <h2>Hola ${userName},</h2>
          <p>Gracias por comprar en DropIA. Tu transacción ha sido procesada exitosamente.</p>
          
          <div class="invoice-details">
            <h3>📋 Detalles de la Factura</h3>
            <p><strong>Número de Factura:</strong> ${invoiceData.invoiceNumber}</p>
            <p><strong>Fecha de Compra:</strong> ${invoiceData.purchaseDate.toLocaleDateString('es-ES')}</p>
            <p><strong>ID de Producto:</strong> ${invoiceData.productId}</p>
          </div>
          
          <div class="product-info">
            <h4>🛍️ Producto Comprado</h4>
            <p><strong>Nombre:</strong> ${invoiceData.productName}</p>
            <p><strong>Precio:</strong> $${invoiceData.price.toFixed(2)} USD</p>
          </div>
          
          <div class="total">
            <p>Total: $${invoiceData.price.toFixed(2)} USD</p>
          </div>
          
          <p>Tu producto digital estará disponible para descargar desde tu panel de usuario.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" class="button">
              Ir a Mi Dashboard
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 DropIA - Tu Marketplace de IA</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject,
    html: emailHtml,
  });
}; 