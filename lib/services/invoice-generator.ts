import { formatCurrency } from '@/lib/utils';

export interface InvoiceData {
  invoiceNumber: string;
  buyerName: string;
  buyerEmail: string;
  productName: string;
  productId: string;
  price: number;
  purchaseDate: Date;
  sellerName?: string;
  category?: string;
}

export const generateInvoiceNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
};

export const generateInvoiceHtml = (invoiceData: InvoiceData): string => {
  const formattedDate = invoiceData.purchaseDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Factura DropIA - ${invoiceData.invoiceNumber}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8f9fa;
        }
        
        .invoice-container {
          max-width: 800px;
          margin: 20px auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          font-weight: 700;
        }
        
        .header p {
          font-size: 1.1rem;
          opacity: 0.9;
        }
        
        .invoice-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          padding: 40px;
          background: #f8f9fa;
        }
        
        .invoice-details, .customer-details {
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2c5aa0;
          margin-bottom: 15px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 8px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 8px 0;
        }
        
        .detail-label {
          font-weight: 500;
          color: #6c757d;
        }
        
        .detail-value {
          font-weight: 600;
          color: #333;
        }
        
        .product-section {
          padding: 40px;
          background: white;
        }
        
        .product-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          padding: 30px;
          margin: 20px 0;
          border-left: 5px solid #667eea;
        }
        
        .product-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2c5aa0;
          margin-bottom: 15px;
        }
        
        .product-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .price-section {
          background: #e8f4fd;
          padding: 25px;
          border-radius: 8px;
          text-align: right;
        }
        
        .total-price {
          font-size: 2rem;
          font-weight: 700;
          color: #2c5aa0;
        }
        
        .footer {
          background: #343a40;
          color: white;
          padding: 30px 40px;
          text-align: center;
        }
        
        .footer h3 {
          margin-bottom: 10px;
          color: #667eea;
        }
        
        .footer p {
          opacity: 0.8;
          margin-bottom: 5px;
        }
        
        .status-badge {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 10px;
        }
        
        @media (max-width: 768px) {
          .invoice-info {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .product-section {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <h1>🧾 FACTURA</h1>
          <p>DropIA - Tu Marketplace de Inteligencia Artificial</p>
        </div>
        
        <div class="invoice-info">
          <div class="invoice-details">
            <h3 class="section-title">📋 Información de la Factura</h3>
            <div class="detail-row">
              <span class="detail-label">Número de Factura:</span>
              <span class="detail-value">${invoiceData.invoiceNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fecha de Emisión:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Estado:</span>
              <span class="detail-value">
                <span class="status-badge">✅ PAGADO</span>
              </span>
            </div>
          </div>
          
          <div class="customer-details">
            <h3 class="section-title">👤 Información del Cliente</h3>
            <div class="detail-row">
              <span class="detail-label">Nombre:</span>
              <span class="detail-value">${invoiceData.buyerName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${invoiceData.buyerEmail}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Fecha de Compra:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
          </div>
        </div>
        
        <div class="product-section">
          <h3 class="section-title">🛍️ Producto Comprado</h3>
          
          <div class="product-card">
            <div class="product-title">${invoiceData.productName}</div>
            
            <div class="product-details">
              <div class="detail-row">
                <span class="detail-label">ID del Producto:</span>
                <span class="detail-value">${invoiceData.productId}</span>
              </div>
              ${invoiceData.category ? `
                <div class="detail-row">
                  <span class="detail-label">Categoría:</span>
                  <span class="detail-value">${invoiceData.category}</span>
                </div>
              ` : ''}
              ${invoiceData.sellerName ? `
                <div class="detail-row">
                  <span class="detail-label">Vendedor:</span>
                  <span class="detail-value">${invoiceData.sellerName}</span>
                </div>
              ` : ''}
            </div>
            
            <div class="price-section">
              <div class="total-price">
                Total: ${formatCurrency(invoiceData.price)}
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <h3>🎉 ¡Gracias por tu compra!</h3>
          <p>Tu producto digital estará disponible para descargar desde tu panel de usuario.</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          <p><strong>© 2024 DropIA - Tu Marketplace de IA</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}; 