import Router from 'koa-trie-router'
import helpers from '../../config/helpers'
//var errorHelper = require('../helpers/error_helper');
import { getLanguage } from '../../config/middlewares'
import constants from '../../config/constants'

let router = new Router()

router.get('/error/access/:num', [
  async (ctx, next) => {
    ctx.status = 404
    let lang = getLanguage(ctx)
    let errorNumber = ctx.params.num
    let registeredErrors = ['404', '5051']
    // check if error content is not registered then, default error 404
    if (registeredErrors.indexOf(errorNumber) == -1){
      errorNumber = '404'
    }
    let locals = {
      constants: constants.data,
      title: `Èrror ${errorNumber}`,
      helpers: helpers,
      // csss: errorHelper.accessCss(),
      // jss: errorHelper.accessJs(),
      // contents: contents.get('error')[lang][errorNumber],
      lang: lang,
    };
    await ctx.render('error/access', locals)
  }
]);

export default router.middleware()
