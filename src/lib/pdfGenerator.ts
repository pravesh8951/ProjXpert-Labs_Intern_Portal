import PDFDocument from 'pdfkit';

const getPlanText = (plan: string) => {
  if (plan === '1m') return '1 Month';
  if (plan === '2m') return '2 Months';
  if (plan === '3m') return '3 Months';
  return 'Internship';
};

const getPlanAmount = (plan: string) => {
  if (plan === '1m') return '999';
  if (plan === '2m') return '1799';
  if (plan === '3m') return '2499';
  return '0';
};

const formatDomain = (domain: string) => {
  if (domain === 'ai') return 'Artificial Intelligence (AI)';
  if (domain === 'cyber') return 'Cybersecurity';
  return domain;
};

export const generateOfferLetterPDF = (name: string, plan: string, domain: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      const planText = getPlanText(plan);
      const domainText = formatDomain(domain);

      // Header
      doc.fontSize(24).fillColor('#0a0a1a').font('Helvetica-Bold').text('ProjXpert Labs', { align: 'center' });
      doc.fontSize(12).fillColor('#475569').font('Helvetica').text('Industry-Oriented Internships | AI & Cybersecurity', { align: 'center' });
      doc.moveDown(2);

      // Title
      doc.fontSize(18).fillColor('#2563eb').font('Helvetica-Bold').text('INTERNSHIP OFFER LETTER', { align: 'center' });
      doc.moveDown(2);

      // Date & Salutation
      doc.fontSize(12).fillColor('#0f172a').font('Helvetica').text(`Date: ${today}`);
      doc.moveDown();
      doc.font('Helvetica-Bold').text(`Dear ${name},`);
      doc.moveDown();
      
      // Body Paragraph 1
      doc.font('Helvetica').text('We are pleased to welcome you to ProjXpert Labs as an Intern under our Industry-Oriented Internship Program.');
      doc.moveDown();
      doc.text('ProjXpert Labs is a registered startup organization working in Artificial Intelligence, Cybersecurity, Full Stack Development, IoT, and Real-World Industry Solutions.');
      doc.moveDown();

      // Details
      doc.font('Helvetica-Bold').text('Internship Details:');
      doc.font('Helvetica').moveDown(0.5);
      doc.text('• Organization: ProjXpert Labs', { indent: 20 });
      doc.text('• MSME Registration ID: UDYAM-KR-03-0685882', { indent: 20 });
      doc.text('• Internship Type: Online Industry Training Internship', { indent: 20 });
      doc.text(`• Duration: ${planText}`, { indent: 20 });
      doc.text('• Mode: Learning + Assignments + Practical Projects', { indent: 20 });
      doc.text(`• Domain: ${domainText}`, { indent: 20 });
      doc.moveDown();

      // Structure
      doc.font('Helvetica-Bold').text('Internship Structure:').moveDown(0.5);
      doc.font('Helvetica').text('The internship is conducted in a structured learning format consisting of:', { indent: 0 });
      doc.text('• Daily Reading Content', { indent: 20 });
      doc.text('• Daily Quizzes', { indent: 20 });
      doc.text('• Weekly Assignments', { indent: 20 });
      doc.text('• Practical Tasks', { indent: 20 });
      doc.text('• Final Evaluation', { indent: 20 });
      doc.moveDown();

      // Evaluation
      doc.font('Helvetica-Bold').text('Certificate & Evaluation:').moveDown(0.5);
      doc.font('Helvetica').text('Upon successful completion of the internship program and evaluation process, candidates may receive:', { indent: 0 });
      doc.text('• Internship Completion Certificate', { indent: 20 });
      doc.text('• Evaluation Report', { indent: 20 });
      doc.text('• Letter of Recommendation (based on performance)', { indent: 20 });
      doc.moveDown();

      // Note
      doc.font('Helvetica-Bold').text('Important Note:').moveDown(0.5);
      doc.font('Helvetica').text('This internship is intended purely for educational and industry-learning purposes. No salary or stipend is provided unless explicitly mentioned separately.', { indent: 0 });
      doc.moveDown(1.5);

      // Sign-off
      doc.text('We wish you a successful learning journey with ProjXpert Labs.');
      doc.moveDown();
      doc.font('Helvetica-Bold').text('Regards,');
      doc.text('ProjXpert Labs');
      doc.text('www.projxpertlabs.in'); // Assuming domain

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export const generateInvoicePDF = (name: string, plan: string, domain: string, paymentId: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
      const planText = getPlanText(plan);
      const domainText = formatDomain(domain);
      const amount = getPlanAmount(plan);
      const shortPaymentId = paymentId.replace('pay_', '').substring(0, 8).toUpperCase();

      // Header
      doc.fontSize(24).fillColor('#0a0a1a').font('Helvetica-Bold').text('ProjXpert Labs');
      doc.fontSize(10).fillColor('#475569').font('Helvetica');
      doc.text('MSME UDYAM Registration: UDYAM-KR-03-0685882');
      doc.text('Email: projxpertlabs@gmail.com');
      doc.text('Industry Training • AI • Cybersecurity • Full Stack Development');
      doc.moveDown(2);

      // Title
      doc.fontSize(20).fillColor('#2563eb').font('Helvetica-Bold').text('INVOICE', { align: 'right' });
      doc.moveDown(1);

      // Invoice Details table (simulated)
      doc.fontSize(10).fillColor('#0f172a');
      doc.font('Helvetica-Bold').text('Invoice Number: ', { continued: true }).font('Helvetica').text(`PX-INV-${shortPaymentId}`);
      doc.font('Helvetica-Bold').text('Invoice Date: ', { continued: true }).font('Helvetica').text(today);
      doc.font('Helvetica-Bold').text('Payment Method: ', { continued: true }).font('Helvetica').text('Razorpay');
      doc.moveDown(1.5);

      doc.font('Helvetica-Bold').text('Billed To:');
      doc.font('Helvetica').text(name);
      doc.text('Service: Internship / Training');
      doc.moveDown(2);

      // Table Header
      const tableTop = doc.y;
      doc.font('Helvetica-Bold');
      doc.text('Description', 50, tableTop);
      doc.text('Qty', 350, tableTop);
      doc.text('Price', 400, tableTop);
      doc.text('Total', 480, tableTop);
      
      // Line
      doc.moveTo(50, doc.y + 5).lineTo(530, doc.y + 5).stroke('#cbd5e1');

      // Table Row
      const rowTop = doc.y + 15;
      doc.font('Helvetica');
      doc.text(`ProjXpert Labs Internship - ${planText} (${domainText})`, 50, rowTop, { width: 280 });
      doc.text('1', 350, rowTop);
      doc.text(`INR ${amount}`, 400, rowTop);
      doc.text(`INR ${amount}`, 480, rowTop);

      // Line
      doc.moveTo(50, doc.y + 15).lineTo(530, doc.y + 15).stroke('#cbd5e1');

      // Grand Total
      const totalTop = doc.y + 30;
      doc.font('Helvetica-Bold').fontSize(12);
      doc.text('Grand Total:', 350, totalTop);
      doc.text(`INR ${amount}`, 460, totalTop);

      // Notes
      doc.fontSize(10).fillColor('#64748b').font('Helvetica');
      doc.text('Terms & Notes:', 50, totalTop + 60);
      doc.text('• Payment once completed is subject to the internship/training policy.', { indent: 10 });
      doc.text('• Certificates and evaluation reports are issued after successful completion.', { indent: 10 });
      doc.text('• This invoice is system generated by ProjXpert Labs and requires no physical signature.', { indent: 10 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
