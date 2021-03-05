import { PDFDocument, StandardFonts, degrees } from 'pdf-lib'
import fs from 'fs'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import constants from '../../config/constants'
import { randomSN } from '../../config/helpers'

async function sendEmail(email, nombre, attachedFile){
  dotenv.config();
  let transporter = nodemailer.createTransport({
    secure: false,//true
    port: 25,//465
    logger: true,
    auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASS, 
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
    subject: `Felicitaciones ${nombre}!!!`, // Subject line
    //text: 'Hello world?', // plain text body
    html: 'This email is sent through <b>GMAIL SMTP SERVER</b>', // html body
    attachments: [
      {   
        path: attachedFile,
      },
    ],
  });
  console.log('Message sent: %s', info.messageId);
}

export async function sendPDF(student, folder, baseFile) {
  const existingPdfBytes = await fs.readFileSync(`${folder}${baseFile}`);
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  // const { width, height } = firstPage.getSize()
  firstPage.drawText(`${student.last_names} ${student.first_names}`, {
    x: 300,
    y: 318,
    size: 19,
    font: helveticaFont,
    //color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(90),
  })
  const secondPage = pages[1]
  secondPage.drawText(student.grade.toString(), {
    x: 345,
    y: 795,
    size: 60,
    font: helveticaFont,
    //color: rgb(0.95, 0.1, 0.1),
    rotate: degrees(90),
  })
  const pdfBytes = await pdfDoc.save();
  const file = `${folder}${student.last_names} ${student.first_names}.pdf`;
  fs.writeFileSync(file, pdfBytes);
  await sendEmail(student.email, `${student.last_names} ${student.first_names}`, file)
}

export const indexCss = () => {
  var rpta = [];
  if(constants.data.static == 'dev'){
    rpta = [
      'bower_components/bootstrap/dist/css/bootstrap.min',
      'bower_components/font-awesome/css/font-awesome.min',
      'assets/css/constants',
      'assets/css/styles',
    ];
  }
  if(constants.data.static == 'produccion'){
    rpta = [
      'dist/test.min'
    ];
  }
  return rpta;
}

export const indexJs = () => {
  var rpta = [];
  if(constants.data.static == 'dev'){
    rpta = [
      'bower_components/jquery/dist/jquery.min',
      'bower_components/bootstrap/dist/js/bootstrap.min',
      'bower_components/underscore/underscore-min',
      'bower_components/backbone/backbone-min',
      'assets/js/app',
    ];
  }
  if(constants.data.static == 'produccion'){
    rpta = [
    ];
  }
  return rpta;
}

export default {
  sendPDF,
  indexCss,
  indexJs,
}