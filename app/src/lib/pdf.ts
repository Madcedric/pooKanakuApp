// src/lib/pdf.ts
// PDF Invoice Generator using pdf-lib
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface InvoicePDFData {
  invoice: {
    id: string;
    billing_month: string;
    total_amount: number;
    paid_amount: number;
    outstanding_amount: number;
    status: string;
    created_at: string;
  };
  customer: {
    name: string;
    phone_number: string | null;
    address: string | null;
  };
  items: {
    flower_name: string;
    unit: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
}

export async function generateInvoicePDF(data: InvoicePDFData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.87]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { invoice, customer, items } = data;
  const monthLabel = new Date(invoice.billing_month).toLocaleDateString('default', { month: 'long', year: 'numeric' });

  let y = 780;

  // Header
  page.drawText('PooKanakuApp', { x: 50, y, size: 22, font: boldFont, color: rgb(0.18, 0.49, 0.20) });
  y -= 20;
  page.drawText('Flower Ledger Pro', { x: 50, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });

  // Invoice title
  page.drawText('INVOICE', { x: 420, y: 780, size: 20, font: boldFont, color: rgb(0.2, 0.2, 0.2) });
  y -= 10;

  // Divider
  page.drawLine({ start: { x: 50, y: y + 15 }, end: { x: 545, y: y + 15 }, thickness: 1, color: rgb(0.85, 0.85, 0.85) });

  // Invoice details
  y -= 15;
  page.drawText(`Invoice ID: ${invoice.id.slice(0, 8)}...`, { x: 420, y, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
  y -= 15;
  page.drawText(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, { x: 420, y, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
  y -= 15;
  page.drawText(`Status: ${invoice.status}`, { x: 420, y, size: 9, font: boldFont, color: invoice.status === 'Paid' ? rgb(0.18, 0.49, 0.20) : rgb(0.9, 0.22, 0.22) });

  // Customer info
  y -= 25;
  page.drawText('BILL TO', { x: 50, y, size: 8, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
  y -= 15;
  page.drawText(customer.name, { x: 50, y, size: 12, font: boldFont });
  if (customer.phone_number) {
    y -= 15;
    page.drawText(customer.phone_number, { x: 50, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
  }
  if (customer.address) {
    y -= 15;
    page.drawText(customer.address, { x: 50, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
  }

  // Billing period
  y -= 25;
  page.drawText('BILLING PERIOD', { x: 50, y, size: 8, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
  y -= 15;
  page.drawText(monthLabel, { x: 50, y, size: 11, font });

  // Table header
  y -= 35;
  page.drawLine({ start: { x: 50, y: y + 10 }, end: { x: 545, y: y + 10 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  page.drawText('Flower Type', { x: 50, y, size: 9, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
  page.drawText('Unit', { x: 200, y, size: 9, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
  page.drawText('Quantity', { x: 280, y, size: 9, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
  page.drawText('Rate', { x: 370, y, size: 9, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
  page.drawText('Amount', { x: 460, y, size: 9, font: boldFont, color: rgb(0.5, 0.5, 0.5) });

  // Table rows
  y -= 20;
  for (const item of items) {
    page.drawText(item.flower_name || '-', { x: 50, y, size: 9, font });
    page.drawText(item.unit || '-', { x: 200, y, size: 9, font });
    page.drawText(item.quantity.toFixed(2), { x: 280, y, size: 9, font });
    page.drawText(`Rs.${item.rate.toFixed(2)}`, { x: 370, y, size: 9, font });
    page.drawText(`Rs.${item.total.toLocaleString()}`, { x: 460, y, size: 9, font: boldFont });
    y -= 18;
  }

  // Divider
  y -= 5;
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });

  // Totals
  y -= 25;
  const totalsX = 380;
  page.drawText('Total Amount:', { x: totalsX, y, size: 10, font });
  page.drawText(`Rs.${invoice.total_amount.toLocaleString()}`, { x: 460, y, size: 10, font: boldFont });

  y -= 20;
  page.drawText('Paid:', { x: totalsX, y, size: 10, font, color: rgb(0.18, 0.49, 0.20) });
  page.drawText(`Rs.${invoice.paid_amount.toLocaleString()}`, { x: 460, y, size: 10, font, color: rgb(0.18, 0.49, 0.20) });

  y -= 25;
  page.drawLine({ start: { x: totalsX, y: y + 10 }, end: { x: 545, y: y + 10 }, thickness: 1, color: rgb(0.2, 0.2, 0.2) });
  page.drawText('Outstanding:', { x: totalsX, y, size: 12, font: boldFont });
  page.drawText(`Rs.${invoice.outstanding_amount.toLocaleString()}`, { x: 460, y, size: 12, font: boldFont, color: rgb(0.9, 0.22, 0.22) });

  // Footer
  y -= 60;
  page.drawLine({ start: { x: 50, y: y + 20 }, end: { x: 545, y: y + 20 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  page.drawText('Thank you for your business!', { x: 50, y, size: 9, font, color: rgb(0.5, 0.5, 0.5) });
  page.drawText('PooKanakuApp — Flower Ledger Pro', { x: 380, y, size: 8, font, color: rgb(0.7, 0.7, 0.7) });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
