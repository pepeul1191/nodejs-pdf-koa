import { PDFDocument, StandardFonts, degrees } from 'pdf-lib'
import fs from 'fs'

function randomSN(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function create() {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  page.drawText('You can create PDFs!')
  const pdfBytes = await pdfDoc.save()
  fs.writeFileSync(`./tmp/${randomSN(5)}.pdf`, pdfBytes);
}

// create().catch(err => console.log(err));

async function edit(name = 'Carlo Tevez') {
  const url = './tmp/Empty.pdf'
  const existingPdfBytes = await fs.readFileSync(url);

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  const { width, height } = firstPage.getSize()
  firstPage.drawText(name, {
    x: 300,
    y: 318,
    size: 19,
    font: helveticaFont,
    //color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(90),
  })

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(`./tmp/${randomSN(5)}.pdf`, pdfBytes);
}

var alumnos = [
  {
    nombre: 'Pepe Valdivia',
    correo: 'pepe.valdivia.caballero@gmail.com',
    nota: 14,
  },
  {
    nombre: 'Yacky Ramiréz',
    correo: 'pepe.valdivia.caballero@gmail.com',
    nota: 17,
  },
  {
    nombre: 'Sila Esculapia',
    correo: 'pepe.valdivia.caballero@gmail.com',
    nota: 20,
  },
]

alumnos.forEach(alumno => {
  edit(alumno.nombre).catch(err => console.log(err));
});

// edit('Yacky Ramirez Rodrigues').catch(err => console.log(err));