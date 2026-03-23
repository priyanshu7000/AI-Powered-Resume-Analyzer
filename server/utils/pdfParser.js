import pdfParse from 'pdf-parse';

export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};

export const validatePDFBuffer = (buffer) => {
  if (!buffer) {
    throw new Error('No file provided');
  }
  if (buffer.length > parseInt(process.env.MAX_FILE_SIZE)) {
    throw new Error('File size exceeds limit');
  }
  return true;
};
