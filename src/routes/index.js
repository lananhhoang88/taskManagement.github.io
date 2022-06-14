const siteRouter = require('./site');
const issuesRouter = require('./issues');
const projectsRouter = require('./projects');
const usersRouter = require('./users');
const categoriesRouter = require('./categories');
const issueTypesRouter = require('./issueTypes');
const priorityLevelsRouter = require('./priorityLevels');
const issueStatusesRouter = require('./issueStatuses');
const meRouter = require('./me');
const reportsRouter = require('./reports');
const fileRouter = require('./file');

function route(app) {
    app.use('/projects', projectsRouter);
    app.use('/issues', issuesRouter);
    app.use('/users', usersRouter);
    app.use('/categories', categoriesRouter);
    app.use('/issueTypes', issueTypesRouter);
    app.use('/priorityLevels', priorityLevelsRouter);
    app.use('/issueStatuses', issueStatusesRouter);
    app.use('/me', meRouter);
    app.use('/reports', reportsRouter);
    app.use('/file', fileRouter);
    app.use('/', siteRouter);
      
}

module.exports = route;