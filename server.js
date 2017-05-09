const app = require('express')()
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')
const port = process.env.PORT || 8080
mongoose.Promise = global.Promise


//mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017')

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

//app.use(require('./app/routes'))

app.get('/', function(req, res, next){
    res.sendStatus(200);
});

/*app.use((req, res) =>  {
	res.sendfile('public/index.html')
})*/


app.listen(port, ()=> {
	console.log(`Magic happens on port ${port}`)
})