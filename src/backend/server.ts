import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { urlencoded, json } from 'body-parser'
import engine from 'ejs-mate'
import dotenv from 'dotenv'
import routes from './routes/_routes'

dotenv.config()

const app = express()

app.use( compression() )
app.use( express.static( 'public' ) )
app.engine( 'ejs', engine )
app.set( 'view engine', 'ejs' )
app.disable('x-powered-by')

app.use( cookieParser() )
app.use(
  urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
  }) 
)
app.use( 
  json({
    limit: '50mb',
    type: ['json', '+json']
  }) 
)

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, ApiKey')

  //intercepts OPTIONS method
  if ( req.method === 'OPTIONS' ) {
    //respond with 200
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use( routes )

app.listen(process.env.NODE_PORT, () => {
  console.info(`App running on port ${ process.env.NODE_PORT } in ${ process.env.NODE_ENV } environment.`)
})

export default app