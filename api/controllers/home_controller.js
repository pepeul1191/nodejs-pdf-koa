import Router from 'koa-trie-router'

let router = new Router()
let path = ''

router.get(`/${path}`, [
  //middlewares.sessionRequiredFalse, 
  async (ctx, next) => {
    await ctx.redirect('/student');
  }
]);

export default router.middleware()
