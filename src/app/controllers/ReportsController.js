const Task = require('../models/Task');
const { multipleMongooseToObject } = require('../../util/mongoose');


class ReportController {

    //[GET] /
    gantt(req, res, next) {
        Task.find({})
            .then(task => {
                res.render('reports/gantt', { 
                    task: multipleMongooseToObject(task) 
                })
            })
            .catch(next);
        
    }

    index(req, res, next) {
        Task.find({status: 'On-Progress'})
            .then(task => {
                res.render('reports/report', { 
                    task: multipleMongooseToObject(task) 
                })
            })
            .catch(next);
        
    }

  
    board(req, res, next) {
        Promise.all([Task.find({status: 'Started'}), Task.find({status: 'On-Progress'}), Task.find({status: 'Done'}), Task.find({status: 'Overdue'}),
                    Task.countDocuments({status: 'Started'}), Task.countDocuments({status: 'On-Progress'}), Task.countDocuments({status: 'Done'}), Task.countDocuments({status: 'Overdue'})])
            .then(([task1, task2, task3, task4, totalTask1, totalTask2, totalTask3, totalTask4]) => {
                res.render('reports/board', {
                   totalTask1,
                   totalTask2,
                   totalTask3,
                    totalTask4,
                    task1: multipleMongooseToObject(task1),
                    task2: multipleMongooseToObject(task2),
                    task3: multipleMongooseToObject(task3),
                    task4: multipleMongooseToObject(task4)
                })
            })
            .catch(next)    
    }
  


}

module.exports = new ReportController;