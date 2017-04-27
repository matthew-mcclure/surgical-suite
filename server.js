const app = require('express')()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')
const port = 8080
mongoose.Promise = global.Promise


mongoose.connect('mongodb://127.0.0.1:27017/sample')

process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}))

app.use(methodOverride('X-HTTP-Method-Override'))

app.use(require('express').static(path.join(__dirname, 'node_modules')))
app.use(require('express').static(path.join(__dirname, 'client/public')))

app.use(require('./app/routes'))

/*app.use((req, res) =>  {
	res.sendfile('public/index.html')
})*/


app.listen(8080, ()=> {
	console.log(`Magic happens on port ${port}`)
})