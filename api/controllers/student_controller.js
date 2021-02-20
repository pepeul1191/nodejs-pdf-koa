import Router from 'koa-trie-router'
import { sendPDF } from '../helpers/student_helper'

let router = new Router()
let path = 'student'

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
