require('dotenv').config()
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser');
const cookieparser = require('cookie-parser')
const errorHandler = require('./Middleware/errorMiddleware');
const multer = require('multer');

const app = express()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: {
    fieldSize: 1024 * 1024 * 10, // Set the fieldSize limit to 10MB (adjust as needed)
  }, });


require('./Config/database') // Initialize Supabase connection
const Router = require('./Routers/index')

app.use(cors())

app.use(bodyParser.json({limit: '5000mb'}));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    limit: '200mb',
    extended: true
    }));
app.use(cookieparser())
app.use(express.json())
app.use(compression())
app.use(errorHandler)
app.use(upload.single('file'))

app.use('/api/NextStudio',Router)

const port = 4000
app.listen(port, () => {
    console.log(`Listening on ${port}`)
})