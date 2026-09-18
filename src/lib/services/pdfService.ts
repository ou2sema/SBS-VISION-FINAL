import { jsPDF } from 'jspdf';
import { DevisData } from '../../types';

/**
 * Creates an offscreen high-resolution image of the SBS VISION emblem + logo
 */
function createLogoCanvas(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Transparent background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Camera-Eye Emblem in Security Red #E11D2A
  ctx.save();
  ctx.translate(10, 10);
  ctx.scale(1.2, 1.2);

  // Red gradient
  const grad = ctx.createLinearGradient(0, 100, 120, 0);
  grad.addColorStop(0, '#C41220');
  grad.addColorStop(1, '#ED2230');

  // Upper Eye Arch & Arrow
  ctx.fillStyle = grad;
  ctx.beginPath();
  // Simplified high-precision path matching Logo.tsx
  ctx.moveTo(15, 62);
  ctx.bezierCurveTo(28, 48, 48, 36, 75, 38);
  ctx.lineTo(72, 26);
  ctx.lineTo(100, 30);
  ctx.lineTo(88, 55);
  ctx.lineTo(80, 44);
  ctx.bezierCurveTo(62, 43, 42, 52, 30, 64);
  ctx.closePath();
  ctx.fill();

  // Lower Eye Arch
  ctx.beginPath();
  ctx.arc(55, 68, 26, 0.2 * Math.PI, 0.9 * Math.PI, false);
  ctx.lineTo(35, 68);
  ctx.closePath();
  ctx.fill();

  // Outer ring
  ctx.beginPath();
  ctx.arc(58, 64, 16, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.fill();

  // Inner cutout white
  ctx.beginPath();
  ctx.arc(58, 64, 10, 0, 2 * Math.PI);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();

  // Center pupil lens red
  ctx.beginPath();
  ctx.arc(58, 64, 5, 0, 2 * Math.PI);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();

  // Draw Typography: SBS VISION
  ctx.font = '900 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#0F172A'; // Dark slate
  ctx.fillText('SBS', 160, 62);

  ctx.fillStyle = '#E11D2A'; // Brand Red
  ctx.fillText('VISION', 260, 62);

  // Subtitle
  ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#64748B'; // Slate gray
  ctx.fillText('SÉCURITÉ ÉLECTRONIQUE & VIDÉOSURVEILLANCE IP', 160, 88);

  ctx.font = '500 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('Partenaire Officiel Certifié Dahua & Hikvision • Tunisie', 160, 108);

  return canvas.toDataURL('image/png');
}

/**
 * Generates an official, publication-quality PDF Devis for SBS VISION
 */
export function generateDevisPDF(data: DevisData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm

  // Colors
  const primaryRed = [225, 29, 42]; // #E11D2A
  const darkNavy = [15, 23, 42]; // #0F172A
  const slateMuted = [100, 116, 139]; // #64748B
  const lightBg = [248, 250, 252]; // #F8FAFC
  const borderGray = [226, 232, 240]; // #E2E8F0

  let currentY = margin;

  // 1. Header with Logo & Company coordinates
  try {
    const logoData = createLogoCanvas();
    if (logoData) {
      doc.addImage(logoData, 'PNG', margin, currentY - 2, 75, 17.5);
    }
  } catch (err) {
    // Fallback if canvas fails
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text('SBS ', margin, currentY + 8);
    doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
    doc.text('VISION', margin + 20, currentY + 8);
  }

  // Company contact info (Right side header)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  const rightX = pageWidth - margin;
  doc.text('SBS VISION SARL - Systèmes de Sécurité', rightX, currentY + 2, { align: 'right' });
  doc.text('Avenue Habib Bourguiba, Tunis - Tunisie', rightX, currentY + 6, { align: 'right' });
  doc.text('Tél : +216 54 306 506  •  Email : contact@sbsvision.tn', rightX, currentY + 10, { align: 'right' });
  doc.text('MF : 1748291/A/M/000  •  Web : www.sbsvision.tn', rightX, currentY + 14, { align: 'right' });

  currentY += 22;

  // Horizontal primary red line
  doc.setDrawColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.setLineWidth(0.8);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // 2. Document Title & Metadata Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'FD');

  // Left Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.text('DEVIS / OFFRE COMMERCIALE', margin + 6, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(
    `Objet : ${data.projectType || 'Fourniture, Câblage & Installation de Vidéosurveillance Professionnelle'}`,
    margin + 6,
    currentY + 14
  );
  doc.text(
    `Solutions de Sécurité Certifiées Haute Définition (Dahua & Hikvision)`,
    margin + 6,
    currentY + 19
  );

  // Right Quote Meta
  const metaRightX = pageWidth - margin - 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(`Devis N° : ${data.quoteNumber}`, metaRightX, currentY + 8, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Date d'émission : ${data.date}`, metaRightX, currentY + 13, { align: 'right' });
  doc.text(`Validité de l'offre : ${data.validityDays} jours`, metaRightX, currentY + 18, { align: 'right' });

  currentY += 29;

  // 3. Client Information Box
  const clientBoxWidth = contentWidth;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, currentY, clientBoxWidth, 22, 2, 2, 'FD');

  // Small badge label
  doc.setFillColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.roundedRect(margin + 4, currentY + 3, 26, 4.5, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('DESTINATAIRE', margin + 6, currentY + 6.3);

  // Client Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text(data.customerName || 'Client Particulier / Professionnel', margin + 34, currentY + 7);

  if (data.customerCompany) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(`Société : ${data.customerCompany}`, margin + 34, currentY + 11.5);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Tél : ${data.customerPhone || '-'}`, margin + 6, currentY + 16);
  if (data.customerEmail) {
    doc.text(`Email : ${data.customerEmail}`, margin + 60, currentY + 16);
  }
  if (data.customerAddress) {
    doc.text(`Lieu du projet : ${data.customerAddress}`, margin + 120, currentY + 16);
  }

  currentY += 27;

  // 4. Products & Services Table
  // Header row
  const colX = {
    num: margin,
    ref: margin + 8,
    desc: margin + 42,
    brand: margin + 118,
    qty: margin + 138,
    price: margin + 152,
    total: pageWidth - margin,
  };

  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(margin, currentY, contentWidth, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  doc.text('N°', colX.num + 2, currentY + 4.8);
  doc.text('RÉFÉRENCE', colX.ref, currentY + 4.8);
  doc.text('DÉSIGNATION DU MATÉRIEL & PRESTATIONS', colX.desc, currentY + 4.8);
  doc.text('MARQUE', colX.brand, currentY + 4.8);
  doc.text('QTÉ', colX.qty + 2, currentY + 4.8);
  doc.text('P.U. HT (DT)', colX.price + 8, currentY + 4.8, { align: 'right' });
  doc.text('TOTAL HT (DT)', colX.total - 2, currentY + 4.8, { align: 'right' });

  currentY += 7;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  data.items.forEach((item, index) => {
    const isAlt = index % 2 === 1;
    const rowHeight = 7.5;

    if (isAlt) {
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    }

    // Border line under row
    doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY + rowHeight, pageWidth - margin, currentY + rowHeight);

    // Columns
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(String(index + 1), colX.num + 2, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    const refSnippet = doc.splitTextToSize(item.reference || '-', 32);
    doc.text(refSnippet[0] || '-', colX.ref, currentY + 5);

    doc.setFont('helvetica', 'normal');
    const descSnippet = doc.splitTextToSize(item.designation, 72);
    doc.text(descSnippet[0] || '-', colX.desc, currentY + 5);

    // Brand tag
    doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
    doc.text(item.brand || 'SBS', colX.brand, currentY + 5);

    // Quantity
    doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
    doc.text(String(item.quantity), colX.qty + 4, currentY + 5);

    // Unit price HT
    doc.text(item.unitPriceHT.toFixed(3), colX.price + 8, currentY + 5, { align: 'right' });

    // Line total HT
    doc.setFont('helvetica', 'bold');
    doc.text(item.totalHT.toFixed(3), colX.total - 2, currentY + 5, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    currentY += rowHeight;
  });

  currentY += 4;

  // 5. Financial Summary & Notes
  const summaryBoxWidth = 72;
  const summaryBoxX = pageWidth - margin - summaryBoxWidth;

  // Left Notes & Warranty area
  const notesWidth = contentWidth - summaryBoxWidth - 6;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, notesWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.text('CONDITIONS GÉNÉRALES & GARANTIES SBS VISION', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('• Matériel Dahua & Hikvision garanti 2 ans pièces et main d\'œuvre constructeur.', margin + 4, currentY + 12);
  doc.text('• Câblage certifié 100% cuivre pur Cat6 sans perte de signal ni dégradation vidéo.', margin + 4, currentY + 17);
  doc.text('• Paramétrage mobile sécurisé sur smartphones (DMSS / Hik-Connect) inclus.', margin + 4, currentY + 22);
  doc.text(`• Modalités de paiement : ${data.paymentTerms || '50% à la commande, solde à la mise en service'}.`, margin + 4, currentY + 27);
  if (data.notes) {
    const customNotes = doc.splitTextToSize(`• Note : ${data.notes}`, notesWidth - 8);
    doc.text(customNotes[0], margin + 4, currentY + 32);
  } else {
    doc.text('• Délai d\'intervention : 48h à 72h après validation du bon de commande.', margin + 4, currentY + 32);
  }
  doc.text('• Service Après-Vente (SAV) prioritaire 7j/7 assuré par les techniciens SBS.', margin + 4, currentY + 37);

  // Right Totals Table
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(summaryBoxX, currentY, summaryBoxWidth, 42, 2, 2, 'FD');

  let rowY = currentY + 5;
  const labelX = summaryBoxX + 4;
  const valX = pageWidth - margin - 4;

  const printTotalLine = (label: string, value: string, isBold = false, isHighlight = false) => {
    if (isHighlight) {
      doc.setFillColor(primaryRed[0], primaryRed[1], primaryRed[2]);
      doc.rect(summaryBoxX, rowY - 3.8, summaryBoxWidth, 7.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(label, labelX, rowY);
      doc.text(value, valX, rowY, { align: 'right' });
    } else {
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
      doc.text(label, labelX, rowY);
      doc.text(value, valX, rowY, { align: 'right' });
    }
    rowY += 5.5;
  };

  printTotalLine('Total Brut HT :', `${data.subtotalHT.toFixed(3)} DT`);
  if (data.discountAmount && data.discountAmount > 0) {
    printTotalLine(`Remise commerciale (${data.discountPercent || 0}%) :`, `-${data.discountAmount.toFixed(3)} DT`);
    printTotalLine('Total Net HT :', `${data.netHT.toFixed(3)} DT`, true);
  } else {
    printTotalLine('Total Net HT :', `${data.netHT.toFixed(3)} DT`, true);
  }
  printTotalLine(`T.V.A. (${data.tvaRate}%) :`, `${data.tvaAmount.toFixed(3)} DT`);
  printTotalLine('Timbre Fiscal :', `${data.timbreFiscal.toFixed(3)} DT`);

  rowY += 1.5;
  printTotalLine('TOTAL TTC À PAYER :', `${data.totalTTC.toFixed(3)} TND`, true, true);

  currentY += 46;

  // 6. Signature & Seal Boxes
  const sigBoxWidth = (contentWidth - 6) / 2;
  const sigBoxHeight = 26;

  // Client Signature Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, currentY, sigBoxWidth, sigBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.text('BON POUR ACCORD & COMMANDE', margin + 4, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Date et signature du client précédée de la mention "Lu et approuvé" :', margin + 4, currentY + 9);

  // SBS VISION Seal Box
  doc.roundedRect(margin + sigBoxWidth + 6, currentY, sigBoxWidth, sigBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.text('POUR SBS VISION SARL', margin + sigBoxWidth + 10, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Cachet commercial et Direction Technique :', margin + sigBoxWidth + 10, currentY + 9);

  // Watermark-like stamp text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
  doc.text('SBS VISION - TUNIS', margin + sigBoxWidth + 30, currentY + 17, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('Département Systèmes de Sécurité', margin + sigBoxWidth + 30, currentY + 20, { align: 'center' });

  // 7. Footer Banner
  const footerY = pageHeight - 10;
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(
    'SBS VISION SARL • Siège social : Tunis, Tunisie • Assistance & Devis 24/7 : +216 54 306 506 • contact@sbsvision.tn',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );
  doc.text('Page 1 / 1', pageWidth - margin, footerY, { align: 'right' });

  return doc;
}

/**
 * Convenience helper to download PDF directly in browser
 */
export function downloadDevisPDF(data: DevisData): void {
  const doc = generateDevisPDF(data);
  const cleanNum = data.quoteNumber.replace(/[^a-zA-Z0-9-_]/g, '_');
  doc.save(`Devis-SBS-VISION-${cleanNum}.pdf`);
}

/**
 * Builds WhatsApp share link with formatted quote summary
 */
export function buildDevisWhatsAppUrl(data: DevisData): string {
  const cleanPhone = (data.customerPhone || '').replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('216')
    ? cleanPhone
    : cleanPhone.length === 8
    ? `216${cleanPhone}`
    : cleanPhone;

  const itemsSummary = data.items
    .map((it) => `• ${it.quantity}x ${it.brand} ${it.designation} (${it.totalHT.toFixed(3)} DT)`)
    .slice(0, 4)
    .join('\n');

  const text = `Bonjour ${data.customerName || ''},

Voici votre devis officiel SBS VISION n° *${data.quoteNumber}* :
Objet : ${data.projectType || 'Installation Vidéosurveillance & Sécurité'}

${itemsSummary}
${data.items.length > 4 ? `(+ ${data.items.length - 4} autres équipements)\n` : ''}
*Total TTC Net à payer : ${data.totalTTC.toFixed(3)} TND*
Garantie : 2 ans constructeur (Dahua / Hikvision)

Le document PDF détaillé a été préparé par notre équipe. Nous restons à votre entière disposition au +216 54 306 506.
Cordialement,
*SBS VISION - Tunis*`;

  return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(text)}`;
}

/**
 * Builds Email mailto: link with formatted quote summary
 */
export function buildDevisMailtoUrl(data: DevisData): string {
  const email = data.customerEmail || '';
  const subject = `Devis SBS VISION n° ${data.quoteNumber} - ${data.projectType || 'Installation Sécurité'}`;

  const body = `Bonjour ${data.customerName || ''},

Veuillez trouver ci-dessous le récapitulatif de votre devis officiel SBS VISION n° ${data.quoteNumber} :

DÉTAIL DU MATÉRIEL ET PRESTATIONS :
${data.items.map((it, idx) => `${idx + 1}. ${it.quantity}x ${it.brand} ${it.designation} - ${it.totalHT.toFixed(3)} DT HT`).join('\n')}

RÉCAPITULATIF FINANCIER :
• Total Net HT : ${data.netHT.toFixed(3)} DT
• TVA (${data.tvaRate}%) : ${data.tvaAmount.toFixed(3)} DT
• Timbre fiscal : ${data.timbreFiscal.toFixed(3)} DT
• TOTAL TTC NET À PAYER : ${data.totalTTC.toFixed(3)} TND

GARANTIE & SERVICE :
- Matériel garanti 2 ans (Dahua / Hikvision)
- Câblage cuivre pur Cat6 et mise en service mobile (iOS / Android) inclus
- Délais d'intervention : 48h à 72h

Pour valider ce devis ou pour toute question technique, vous pouvez nous joindre directement au +216 54 306 506.

Cordialement,
L'équipe SBS VISION
Tunis, Tunisie
Web : www.sbsvision.tn`;

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
