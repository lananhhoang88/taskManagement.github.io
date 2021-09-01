const User = require('../models/User');
const slug = require('mongoose-slug-generator');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class UserController {
    //[GET] /users/show (user list)
    show(req, res, next) {
        User.find({})
            .then(user => {
                res.render('users/show', { 
                    user: multipleMongooseToObject(user) 
                })
            })
            .catch(next);
        
    }
    //[GET] /users/show/:slug (show a user)
    showUser(req, res, next) {
        User.findOne({slug: req.params.slug})
            .then(user => {
                res.render('users/viewUser', { user: mongooseToObject(user) })
            })
            .catch(next);

    }

    //[GET] /users/create
    create(req, res, next) {
        res.render('users/create');

    }

    //[POST] /users/store
    store(req, res, next) {
        const user = new User(req.body);
        user.save()
            .then(() => res.redirect('/users/show'))
            .catch(next);
    }

    //[POST] /users/search
    search(req, res, next) {
        User.findOne({fullName: req.body.q})
            .then( user => {
                res.render('users/search',  { user: mongooseToObject(user) })
            })
            .catch(next);
    }

    //[GET] /users/:id/edit
    edit(req, res, next) {
        User.findById(req.params.id)
            .then(user => {
                res.render('users/edit', { user: mongooseToObject(user) });
            })
            .catch(next);
        
    }

    //[PUT] /users/:id
    update(req, res, next) {
        User.updateOne({_id:req.params.id}, req.body)
            .then(() => res.redirect('/users/show'))
            .catch(next);
    }

    //[DELETE] /users/:id
    destroy(req, res, next) {
        User.delete({ _id:req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /users/:id/force
    forceDestroy(req, res, next) {
        User.deleteOne({ _id:req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

     //[PATCH] /users/:id/restore
    restore(req, res, next) {
        User.restore({ _id:req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    
}


module.exports = new UserController();