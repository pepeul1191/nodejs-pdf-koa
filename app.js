import Koa from 'koa'
import serveStatic from 'koa-static'
import render from 'koa-ejs'
import session from 'koa-session'
import path from 'path'
import koaBody from 'koa-body'
import IO from 'koa-socket-2'
// export configs
// import sockets from './config/sockets'
import constants from './config/constants'
import { preResponse, showLogs, internalErrorHandler, errorNotFoundHandler } from './config/middlewares'
import bootstrap from './config/bootstrap'
// new app
const app = new Koa()
const io = new IO();
app.use(koaBody(constants.uploader_options))
app.use(session(constants.session, app))
app.keys = ['rnbfpzfuywmiwtfrrlomwlzlhdxfxjnfifzvkrloobswyoifkt']
// static files
app.use(serveStatic(__dirname + '/public'))
// views EJS
render(app, {
  root: path.join(__dirname, 'views'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
})
// middlewares
app.use(preResponse())
app.use(showLogs())
// error 500 handler
app.use(internalErrorHandler)
// forward routes
bootstrap(app)
// error 404 handler
app.use(errorNotFoundHandler)
app.listen(3000)
