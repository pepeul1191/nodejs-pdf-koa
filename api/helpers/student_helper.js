import { PDFDocument, StandardFonts, degrees } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'
import nodemailer from 'nodemailer'
import constants from '../../config/constants'
import mailTemplate from '../../views/mails/congratulaion'
import _ from 'underscore'

async function sendEmail(email, subject, name, attachedFile, type){
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
  // template
  var compiled = _.template(mailTemplate);
  // send mail with defined transport object
  /*
  <option value="course"><!--Curso de Cortesía-->Curso Grabado</option>
  <option value="free-course"><!--Curso Libre-->Curso en Vivo</option>
  */
  if(type == 'certified'){
    type = 'Diplomado';
  }
  if(type == 'course'){
    type = 'Curso Grabado';
  }
  if(type == 'free-course'){
    type = 'Curso En Vivo';
  }
  let info = await transporter.sendMail({
    from: '"Legis Juristas" <info@legisjuristas.com>', // sender address
    to: email, // list of receivers
    subject: `Gracias por su preferencia ${subject}`, // Subject line
    //text: 'Hello world?', // plain text body
    html: compiled({
      name: name,
      type: type,
      base_url: 'http://legisjuristas.com/',
      subject: subject,
    }), // html body
    attachments: [
      {   
        path: attachedFile,
      },
    ],
  });
  console.log('Message sent: %s', info.messageId);
}

export async function sendPDF(student, folder, baseFile, type) {
  const existingPdfBytes = await fs.readFileSync(`${folder}${baseFile}`);
  const pdfDoc = await PDFDocument.load(existingPdfBytes)
  // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]
  // const { width, height } = firstPage.getSize()
  pdfDoc.registerFontkit(fontkit);
  //load font and embed it to pdf document
  const fontBytes = fs.readFileSync(path.join(path.dirname(require.main.filename), 'public', 'assets', 'fonts', 'Palatino Linotype.ttf'));
  const customFont = await pdfDoc.embedFont(fontBytes);
  // student name -> certified, course, free-course
  // nama starts at 500, ends at 2400
  let pixelNameLength = (`${student.last_names} ${student.first_names}`).length * 22;
  firstPage.drawText(`${student.last_names} ${student.first_names}`.toUpperCase(), {
    x: (250 + (1900 - pixelNameLength) / 2),
    y: 925,
    size: 60,
    font: customFont,
    //color: rgb(0.95, 0.1, 0.1),
    //rotate: degrees(90),
  })
  const secondPage = pages[1]
  // student grade -> certificate, course
  if(type == 'certified'){
    secondPage.drawText(student.grade.toString(), {
      x: 2150,
      y: 700,
      size: 200,
      font: customFont,
      //color: rgb(0.95, 0.1, 0.1),
      //rotate: degrees(90),
    })
    secondPage.drawText(student.code.toString(), {
      x: 2170,
      y: 1130,
      size: 60,
      font: customFont,
      //color: rgb(0.95, 0.1, 0.1),
      //rotate: degrees(90),
    })
  }
  // student code -> course
  if(type == 'course'){
    secondPage.drawText(student.code.toString(), {
      x: 2270,
      y: 980,
      size: 60,
      font: customFont,
      //color: rgb(0.95, 0.1, 0.1),
      //rotate: degrees(90),
    })
  }
  const pdfBytes = await pdfDoc.save();
  const file = `${folder}${student.last_names} ${student.first_names}.pdf`;
  fs.writeFileSync(file, pdfBytes);
  if(type != 'certified'){
    await sendEmail(student.email, student.subject, `${student.last_names} ${student.first_names}`, file, type)
  }
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