import Router from 'koa-trie-router'
//var helpers = require('../../config/helpers');
//var errorHelper = require('../helpers/error_helper');
import { getLanguage } from '../../config/middlewares'
import constants from '../../config/constants'

let router = new Router()

router.get('/error/access/:num', [
  async (ctx, next) => {
    ctx.status = 404;
    let lang = getLanguage(ctx);
    let error_number = ctx.params.num;
    let registered_errors = ['404', '5051'];
    // check if error content is not registered then, default error 404
    if (registered_errors.indexOf(error_number) == -1){
      error_number = '404';
    }
    let locals = {
      constants: constants.data,
      // title: contents.titles()[lang]['error'],
      // helpers: helpers,
      // csss: errorHelper.accessCss(),
      // jss: errorHelper.accessJs(),
      // contents: contents.get('error')[lang][error_number],
      lang: lang,
    };
    await ctx.render('error/access', locals);
  }
]);

export default router.middleware()
