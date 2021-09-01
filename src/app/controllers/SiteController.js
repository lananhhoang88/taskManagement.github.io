const Task = require('../models/Task');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');
class SiteController {

    //[GET] /home
    index(req, res, next) {
      Promise.all([Task.find({status: 'On-Progress'}), Task.countDocuments(), User.countDocuments()])
          .then(([task, totalTask, totalUser]) => {
              res.render('site/home', {
                 totalTask,
                 totalUser,
                  task: multipleMongooseToObject(task),
              })
          })
          .catch(next)    
  }

    login(req, res, next) {
        res.render('site/login')
    }
    
    authenticate(req, res, next) {
        var userName = req.body.userName;
        var password = req.body.password;
      
        User.findOne({ userName: userName })
          .then ( user => {
            if (user) {
              bcrypt.compare (password, user.password, function(err, result) {
                if (err) {
                  res.json ({
                    error: err
                  })
                }
                if (result) {
                  let token = jwt.sign({name: user.userName}, 'verySecretValue', {expiresIn: '1h'});
                  res.json({
                    message: 'Login Successfull',
                    token
                  })
                } else { 
                        Task.find({status: 'On-Progress'})
                            .then(task => {
                                res.render('site/home', { 
                                    task: multipleMongooseToObject(task),
                                    user: mongooseToObject(user) 
                                })
                            })
                            .catch(next);
                }
              })
            } else {
              res.json({
                message: 'no user found'
              })
            }
          })
          .catch(next)
      }


}

module.exports = new SiteController;