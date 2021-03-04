import Router from 'koa-trie-router'
import helpers from '../../config/helpers'
import { sendPDF, indexCss, indexJs } from '../helpers/student_helper'
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

export default router.middleware()
