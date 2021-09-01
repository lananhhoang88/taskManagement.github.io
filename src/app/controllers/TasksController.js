const Task = require('../models/Task');
const User = require('../models/User');
const TaskDetail = require('../models/TaskDetail');
const slug = require('mongoose-slug-generator');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');


class TaskController {
    //[GET] /tasks/show (list task)
    show(req, res, next) {
        Task.find({})
            .then(task => {
                res.render('tasks/show', { 
                    task: multipleMongooseToObject(task) 
                })
            })
            .catch(next);
        
    }
    
    //[GET] /users/show/:slug (show a user)
    showTask(req, res, next) {
        Task.findOne({slug: req.params.slug})
            .then(task => {
                const tasks = mongooseToObject(task);
                const leadId = tasks.leaderId; 
                const detail = tasks.taskId;
                

               User.findOne({userId: leadId})
                    .then(user => {
                       res.render('tasks/viewTask', { task: tasks, users: mongooseToObject(user).fullName})
                    } )
                    .catch(next);
             
                /* TaskDetail.find({taskId: detail})
                    .then(taskDetail => {
                        //const taskDetails = multipleMongooseToObject(taskDetail);
                        //const performerId = taskDetails.userId;
                      
                        User.findOne({userId: performerId})
                            .then(performer => {
                                //res.json(detail)
                                { performer = mongooseToObject(performer) }
                            })
                            .catch(next);
        
                        { taskDetail = multipleMongooseToObject(taskDetail)}; 
                    } )
                    .catch(next);  */



                res.render('tasks/viewTask', { task: mongooseToObject(task) })
            })
            .catch(next);

    }


    //[GET] /tasks/create
    create(req, res, next) {
        res.render('tasks/create');

    }

    //[POST] /tasks/store
    store(req, res, next) {
        const task = new Task(req.body);
        task.save()
            .then(() => res.redirect('/tasks/show'))
            .catch(next);
    }
    

    //[POST] /tasks/search
    search(req, res, next) {
        Task.findOne({taskName: req.body.q})
            .then( task => {
                res.render('tasks/show',  { task: mongooseToObject(task) })
            })
            .catch(next);
    }

    //[GET] /tasks/:id/edit
    edit(req, res, next) {
        Task.findById(req.params.id)
        .then(task => {
            res.render('tasks/edit', { task: mongooseToObject(task) });
        })
        .catch(next);
        
    }

    //[PUT] /tasks/:id
    update(req, res, next) {
        Task.updateOne({_id:req.params.id}, req.body)
            .then(() => res.redirect('/tasks/show'))
            .catch(next);
    }

    //[DELETE] /tasks/:id
    destroy(req, res, next) {
        Task.delete({ _id:req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /tasks/:id/force
    forceDestroy(req, res, next) {
        Task.deleteOne({ _id:req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

     //[PATCH] /tasks/:id/restore
    restore(req, res, next) {
        Task.restore({ _id:req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //TASK DEATAIL
    //[POST] /taskdetail/store
    storeTaskDetail(req, res, next) {
        const taskDetail = new TaskDetail(req.body);
        taskDetail.save()
            .then(() => res.redirect('/tasks/viewTask'))
            .catch(next);
    }

    //[GET] /tasks/taskdetail/:id/edit
    editTaskDetail(req, res, next) {
        TaskDetail.findById(req.params.id)
        .then(taskDetail => {
            res.render('tasks/viewTask', { taskDetail: mongooseToObject(taskDetail) });
        })
        .catch(next);
        
    }

    //[PUT] /tasks/taskdetail/:id
    updateTaskDetail(req, res, next) {
        TaskDetail.updateOne({_id:req.params.id}, req.body)
            .then(() => res.redirect('/tasks/viewTask'))
            .catch(next);
    }

    
}

module.exports = new TaskController();