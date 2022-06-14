const Project = require('../models/Project');
const Issue = require('../models/Issue');
const Status = require('../models/IssueStatus');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthKey, SecretKey, UserInfo, CheckAuth } = require('./../../util/auth');

const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');
class SiteController {

    //[GET] /home
    async index(req, res, next) {
        const result = CheckAuth(req, res);
        if (!result) return;
        const itemStatus = await Status.findOne({ issueStatusName: 'In Progress' });
        const status = itemStatus ? itemStatus._id : '';
        const lstItem = multipleMongooseToObject(await Project.find({ status }));
        const [
            lstUser,
            lstStatus,
            totalProject,
            totalIssue,
            totalUser

        ] = await Promise.all([
            User.find({}),
            Status.find({}),
            Project.countDocuments(),
            Issue.countDocuments(),
            User.countDocuments()
        ]);

        const viewData = {
            project: lstItem,
            totalProject: totalProject,
            totalIssue: totalIssue,
            totalUser: totalUser
        };
        lstItem.forEach(item => {
            const itemManager = lstUser.find(q => q._id == item.projectManager);
            if (itemManager) item.projectManagerName = itemManager.fullName;
            else item.projectManagerName = 'Lỗi dữ liệu';

            const itemStatus = lstStatus.find(q => q._id == item.status);
            if (itemStatus) item.statusName = itemStatus.issueStatusName;
            else item.statusName = 'Lỗi dữ liệu';
        });
        res.render('site/home', viewData);

    }

    login(req, res, next) {
        res.render('site/login')
    }

    logout(req, res, next) {
        res.cookie(AuthKey, null);
        res.redirect('/login');
    }

    authenticate(req, res, next) {
        var email = req.body.email;
        var password = req.body.password;

        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    if (password == user.password) {
                        var token = jwt.sign({ name: user.email }, SecretKey, {
                            expiresIn: '1h'
                        });
                        res.cookie(AuthKey, token);
                        res.cookie(UserInfo, { ...user, password: undefined });
                        res.json({
                            message: 'Login Successfull',
                            success: true,
                            token
                        })
                    } else {
                        res.json({
                            message: 'Wrong password',
                            success: false
                        })
                        return;
                    }

                } else {
                    res.json({
                        message: 'no user found',
                        success: false
                    })
                }
            })
            .catch(next)
    }
}

module.exports = new SiteController;