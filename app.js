// Configuration
var config = require('./config');

// Thirdparty Modules
var express = require('express');
var debug = require('debug')('wonderq');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Services
var infoService = require('./services/infoService');

// Routes
var index = require('./routes/index');
var info = require('./routes/info');
var queue = require('./routes/queue');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware enablement
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Define the work and pending structures
var Queue = require('queue-fifo');
work = new Queue();
var HashMap = require('hashmap');
pending = new HashMap();

// Define endpoint routes
app.use('/', index);
app.use('/api/v1/info', info);
app.use('/api/v1/queue', queue);

// Set up Swagger as API documentation
var swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Enable the periodic cleanup of unprocessed pending messages
function cleanupPending() {
    // Function to periodically check the pending queue for timeouts.
    // If message has been pending too long, requeue for work
    debug("Queue state before cleanup: %j", infoService.getInfo());
    let keys = pending.keys();
    for (const key of keys) {
        let curMess = pending.get(key);
        if (Date.now() - curMess.dequeueTime > config.confirmation_timeout) {
          pending.delete(key)
          work.enqueue(curMess);
        }
    }
}

setInterval(cleanupPending, 1000);


////Generated boilerplate
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;