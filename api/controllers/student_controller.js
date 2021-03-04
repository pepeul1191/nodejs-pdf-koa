import Router from 'koa-trie-router'
import mime from 'mime-types'
import helpers from '../../config/helpers'
import fs from 'fs-extra'
import { sendPDF, indexCss, indexJs } from '../helpers/student_helper'
import random from '../helpers/random'
import constants from '../../config/constants'

let router = new Router()
let path = 'student'

router.get(`/${path}`, [
  async (ctx, next) => {
    let locals = {
      constants: constants.data,
      title: 'Gestión de envios de PDFs',
      helpers: helpers,
      csss: indexCss(),
      jss: indexJs(),
      contents: {},
    };
    await ctx.render('student/index', locals)
  }
]);

router.post(`/${path}/send_pdfs`, [
  //middlewares.sessionRequiredFalse, 
  async (ctx, next) => {
    var status = 200
    var resp = {
      action_executed: '',
    }
    var students = JSON.parse(ctx.request.body.data)
    students.forEach(student => {
      sendPDF(student)
    })
    // response
    ctx.set('Content-Type', 'text/html charset=utf-8')
    ctx.status = status
    ctx.body = JSON.stringify(resp)
  }
]);

router.post(`/${path}/upload`, [
  //middlewares.sessionRequiredFalse,
  async (ctx, next) => {
    var resp = '';
    try {
      var {path, name, type} = ctx.request.files.pdf_file;
      var file_extension = mime.extension(type);
      name = random(30) + '.' + file_extension;
      var timestamp = Math.floor(Date.now() /1000);
      await fs.copy(path, `tmp/${timestamp}/${name}`);
      resp = JSON.stringify({
        name: name,
        folder: `./tmp/${timestamp}/`,
      });
    } catch (err) {
      ctx.throw(500, err);
    }
    // response
    ctx.set('Content-Type', 'text/html; charset=utf-8');
    ctx.status = 200;
    ctx.body = resp;
  }
]);

export default router.middleware()
