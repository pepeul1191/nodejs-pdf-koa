import errorRouter from '../api/controllers/error_controller'

export default (app) => {
  app.use(errorRouter)
}
