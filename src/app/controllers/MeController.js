const Course = require('../models/Course');
const User = require('../models/User');
const Task = require('../models/Task');

const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');


class MeController {

    //[GET] /me/stored/courses
    storedCourses(req, res, next) {
        Promise.all([Course.find({}), Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => {
                res.render('me/stored-courses', {
                    deletedCount,
                    courses: multipleMongooseToObject(courses),
                })
            })
            .catch(next)    
    }

    //[GET] /me/trash/courses
    trashCourses(req, res, next) {
        Course.findDeleted({ })
            .then(courses => res.render('me/trash-courses', {
                courses: multipleMongooseToObject(courses)
            } ))
            .catch(next);
    }

    //[GET] /me/manageAccount/:id/edit
    edit(req, res, next) {
        User.findById(req.params.id)
        .then(user => {
            res.render('me/manageAccount', { user: mongooseToObject(user) });
        })
        .catch(next);
        res.render('me/manageAccount')
        
    }

    //[PUT] /me/manageAccount/:id
    update(req, res, next) {
        User.updateOne({_id:req.params.id}, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    }

}

module.exports = new MeController();