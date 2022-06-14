const User = require('../models/User');
const File = require('../models/File');
const { v4: uuidv4 } = require('uuid');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class UserController {
    //[GET] /users/show (user list)
    show(req, res, next) {
        const searchObj = {};
        const searchData = {};
        if (req.body.q) {
            searchObj.fullName = { '$regex': req.body.q, '$options': 'i' };
            searchData.q = req.body.q;
        }
        User.find(searchObj)
            .then(user => {
                res.render('users/show', {
                    user: multipleMongooseToObject(user),
                    search: searchData
                })
            })
            .catch(next);

    }
    //[GET] /users/show/:slug (show a user)
    showUser(req, res, next) {
        User.findOne({ slug: req.params.slug })
            .then(user => {
                res.render('users/viewUser', { user: mongooseToObject(user) })
            })
            .catch(next);

    }

    //[GET] /users/create
    create(req, res, next) {
        res.render('users/detail', {
            isFormAdd: true,
            lstGender: [
                { _id: 'Male', name: 'Male' },
                { _id: 'Female', name: 'Female' },
                { _id: 'Other', name: 'Other' }
            ],
            lstRole: [
                { _id: 'Admin', name: 'Admin' },
                { _id: 'Manager', name: 'Manager' },
                { _id: 'Employee', name: 'Employee' }
            ]
        });
    }

    //[POST] /users/store
    store(req, res, next) {
        const user = new User(req.body, res.file);
        user.save()
            .then(() => res.redirect('/users/list'))
            .catch(next);
    }

    //[GET] /users/:id/edit
    async edit(req, res, next) {
        const itemUser = mongooseToObject(await User.findById(req.params.id));
        // Lấy thông tin file đính kèm
        const fileData = await File.findOne({ id: itemUser.avatar });
        if (fileData)
            itemUser.avatarName = fileData.name;
        const viewData = {
            isFormAdd: false,
            user: itemUser,
            lstGender: [
                { _id: 'Male', name: 'Male' },
                { _id: 'Female', name: 'Female' },
                { _id: 'Other', name: 'Other' }
            ],
            lstRole: [
                { _id: 'Admin', name: 'Admin' },
                { _id: 'Manager', name: 'Manager' },
                { _id: 'Employee', name: 'Employee' }
            ]
        };

        const itemGenderSelected = viewData.lstGender.find(q => q._id == itemUser.gender);
        if (itemGenderSelected) itemGenderSelected.selected = true;

        const itemRoleSelected = viewData.lstRole.find(q => q._id == itemUser.role);
        if (itemRoleSelected) itemRoleSelected.selected = true;

        res.render('users/detail', viewData);
    }

    //[PUT] /users/:id
    async update(req, res, next) {
        const updateData = { ...req.body };
        delete updateData._id;
        if (req.body.avatar) {
            // Lưu file vào database
            const itemFile = new File();
            const objFileInReq = JSON.parse(req.body.avatar);
            itemFile.id = uuidv4();
            itemFile.name = objFileInReq.originalname;
            itemFile.path = objFileInReq.filename;
            itemFile.created = new Date();
            await itemFile.save();
            updateData.avatar = itemFile.id;
        }
        User.updateOne({ _id: req.params.id }, updateData)
            .then(() => res.redirect('/users/list'))
            .catch(next);
    }

    //[DELETE] /users/:id
    destroy(req, res, next) {
        User.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /users/:id/force
    forceDestroy(req, res, next) {
        User.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[PATCH] /users/:id/restore
    restore(req, res, next) {
        User.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


}


module.exports = new UserController();