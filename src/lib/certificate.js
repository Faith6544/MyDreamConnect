import { jsPDF } from 'jspdf';

export function generateCertificate({
  studentName,
  courseName,
  issuedDate,
  certificateId,
} = {}) {
  const safeStudentName = (studentName || 'Student').trim().slice(0, 80);
  const safeCourseName = (courseName || 'Course').trim();
  const safeIssuedDate = issuedDate || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const safeId = certificateId || 'PENDING';

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const W = doc.internal.pageSize.getWidth();   // 297
  const H = doc.internal.pageSize.getHeight();  // 210

  // Outer green border
  doc.setDrawColor(10, 71, 17);
  doc.setLineWidth(3);
  doc.rect(8, 8, W - 16, H - 16);

  // Inner gold border
  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.6);
  doc.rect(14, 14, W - 28, H - 28);

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 71, 17);
  doc.setFontSize(22);
  doc.text('MyDreamConnect', W / 2, 42, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text('Academy for Change & Development Foundation', W / 2, 50, { align: 'center' });

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(30, 30, 30);
  doc.text('Certificate of Completion', W / 2, 78, { align: 'center' });

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 90);
  doc.text('This certificate is proudly presented to', W / 2, 98, { align: 'center' });

  // Student name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(10, 71, 17);
  doc.text(safeStudentName, W / 2, 118, { align: 'center' });

  // Underline under student name
  const nameWidth = doc.getTextWidth(safeStudentName);
  doc.setDrawColor(212, 160, 23);
  doc.setLineWidth(0.5);
  doc.line(W / 2 - nameWidth / 2 - 10, 122, W / 2 + nameWidth / 2 + 10, 122);

  // Course
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(90, 90, 90);
  doc.text('for successfully completing the course', W / 2, 134, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 30, 30);
  doc.text(safeCourseName, W / 2, 148, { align: 'center', maxWidth: W - 60 });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(140, 140, 140);
  doc.text(`Issued on ${safeIssuedDate}`, W / 2, 172, { align: 'center' });

  doc.setFontSize(8);
  doc.text(`Certificate ID: ${safeId}`, W / 2, 178, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(160, 160, 160);
  doc.text('Verify at mydreamconnect.org.ng', W / 2, 186, { align: 'center' });

  return doc;
}

export function downloadCertificate(data = {}) {
  const doc = generateCertificate(data);
  const courseName = data.courseName || 'Course';
  const safeFilename = courseName
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'Course';
  doc.save(`MyDreamConnect-Certificate-${safeFilename}.pdf`);
}