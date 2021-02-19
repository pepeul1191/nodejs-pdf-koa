import { PDFDocument, StandardFonts, degrees } from 'pdf-lib'
import fs from 'fs'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

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

async function sendEmail(email, pdf){
  dotenv.config();
  console.log('1+++++++++++++++++++++++++++++++++++++++++++++++++')
  console.log(process.env.MAIL_USER)
  console.log(process.env.MAIL_PASS)
  console.log('2+++++++++++++++++++++++++++++++++++++++++++++++++')
  let transporter = nodemailer.createTransport({
    secure: false,//true
    port: 25,//465
    logger: true,
    auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASS, // generated ethereal password
    },
    service: 'gmail',
    tls: {
      rejectUnauthorized: false
    }
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
      from: '"Legis Juristas" <info@legisjuristas.com>', // sender address
      to: email, // list of receivers
      subject: "Welcome Email", // Subject line
      //text: "Hello world?", // plain text body
      html: "This email is sent through <b>GMAIL SMTP SERVER</b>", // html body
  });
  console.log("Message sent: %s", info.messageId);
}

async function edit(alumno) {
  const url = './tmp/Empty.pdf'
  const existingPdfBytes = await fs.readFileSync(url);

  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  // const { width, height } = firstPage.getSize()
  firstPage.drawText(alumno.nombre, {
    x: 300,
    y: 318,
    size: 19,
    font: helveticaFont,
    //color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(90),
  })
  const secondPage = pages[1]
  secondPage.drawText(alumno.nota.toString(), {
    x: 345,
    y: 795,
    size: 60,
    font: helveticaFont,
    //color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(90),
  })

  const pdfBytes = await pdfDoc.save();
  const file = `./tmp/${randomSN(5)}.pdf`;
  fs.writeFileSync(file, pdfBytes);
  await sendEmail(alumno.correo, file)
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
  edit(alumno).catch(err => console.log(err));
});

// edit('Yacky Ramirez Rodrigues').catch(err => console.log(err));
