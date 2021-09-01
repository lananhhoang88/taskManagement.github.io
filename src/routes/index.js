const siteRouter = require('./site');
const coursesRouter = require('./courses');
const tasksRouter = require('./tasks');
const usersRouter = require('./users');
const meRouter = require('./me');
const reportsRouter = require('./reports');

function route(app) {
    app.use('/tasks', tasksRouter);
    app.use('/users', usersRouter);
    app.use('/courses', coursesRouter);
    app.use('/me', meRouter);
    app.use('/reports', reportsRouter);
    app.use('/', siteRouter);
      
}

module.exports = route;