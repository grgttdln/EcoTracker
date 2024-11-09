// ../components/generateCertificate.js

import jsPDF from 'jspdf';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

const generateCertificate = async (displayName) => {
  try {
  console.log(RNFS.DocumentDirectoryPath);

    // Create a new jsPDF instance
    const pdf = new jsPDF();

    // Set up the certificate design
    pdf.setFontSize(24);
    pdf.text('Certificate of Achievement', 50, 40);

    pdf.setFontSize(16);
    pdf.text(`This is to certify that`, 70, 60);
    pdf.setFontSize(20);
    pdf.text(displayName, 80, 80);
    pdf.setFontSize(16);
    pdf.text(`has achieved a top ranking in our weekly leaderboards!`, 35, 100);

    pdf.setFontSize(14);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 75, 130);

    // Save the PDF as a base64 string
    const pdfOutput = pdf.output('datauristring');
    const base64PDF = pdfOutput.split(',')[1];

    // Define the file path for the PDF
    const path = `${RNFS.DocumentDirectoryPath}/certificate-${displayName}.pdf`;

    // Write the PDF to the file system
    await RNFS.writeFile(path, base64PDF, 'base64');

    // Share the PDF
    await Share.open({
      url: `file://${path}`,
      message: `Congratulations ${displayName}! Here is your certificate.`,
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
  }
};

export default generateCertificate;
