import errorRouter from '../api/controllers/error_controller'
import studentRouter from '../api/controllers/student_controller'
import homeRouter from '../api/controllers/home_controller'

export default (app) => {
  app.use(errorRouter),
  app.use(studentRouter),
  app.use(homeRouter)
}
