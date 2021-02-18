import { PDFDocument } from 'pdf-lib'
import fs from 'fs'

// PDF Creation
async function start() {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  page.drawText('You can create PDFs!')
  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync('./tmp/test.pdf', pdfBytes);
}

start().catch(err => console.log(err));