const Project = require('../models/Project');
const Status = require('../models/IssueStatus');
const Issue = require('../models/Issue');
const User = require('../models/User');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { CheckAuth } = require('./../../util/auth');

class ProjectController {
    //[GET] /projects/show (list project)
    async show(req, res, next) {
        const result = CheckAuth(req, res);
        if (!result) return;

        const searchObj = {};
        const searchData = {};
        if (req.body.q) {
            searchObj.projectName = { '$regex': req.body.q, '$options': 'i' };
            searchData.q = req.body.q;
        }

        const lstItem = multipleMongooseToObject(await Project.find(searchObj));
        const viewData = {
            project: lstItem,
            search: searchData
        };
        const [
            lstUser,
            lstStatus
        ] = await Promise.all([
            User.find({}),
            Status.find({})
        ]);
        lstItem.forEach(item => {
            const itemManager = lstUser.find(q => q._id == item.projectManager);
            if (itemManager) item.projectManagerName = itemManager.fullName;
            else item.projectManagerName = 'Lỗi dữ liệu';

            const itemStatus = lstStatus.find(q => q._id == item.status);
            if (itemStatus) item.statusName = itemStatus.issueStatusName;
            else item.statusName = 'Lỗi dữ liệu';
        });
        res.render('projects/show', viewData);

    }

    async getAll(req, res, next) {
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        const lstItem = multipleMongooseToObject(await Project.find({}));
        res.json(lstItem);
    }

    async updateItem(req, res, next) {
        await Project.updateOne({ _id: req.params.id }, req.body)
        res.json({
            success: true
        });
    }

    //[GET] /users/show/:slug (show a user)
    async showProject(req, res, next) {
        let itemProject = await Project.findOne({ slug: req.params.slug });
        itemProject = mongooseToObject(itemProject);
        const viewData = {
            project: itemProject,
            originalUrl: req.originalUrl
        };
        // Lấy thông tin issue
        const lstIssue = multipleMongooseToObject(await Issue.find({ project: itemProject._id }));
        viewData.issues = lstIssue;
        const [
            lstProject,
            lstStatus,
            lstUser
        ] = await Promise.all([
            Project.find({}),
            Status.find({}),
            User.find({})
        ]);
        lstIssue.forEach(item => {
            const itemProject = lstProject.find(q => q._id == item.project);
            if (itemProject) item.projectName = itemProject.projectName;
            else item.projectName = 'Lỗi dữ liệu';

            const itemStatus = lstStatus.find(q => q._id == item.status);
            if (itemStatus) item.statusName = itemStatus.issueStatusName;
            else item.statusName = 'Lỗi dữ liệu';

            const itemUser = lstUser.find(q => q._id == item.assignee);
            if (itemUser) item.assigneeName = itemUser.fullName;
            else item.statusName = 'Lỗi dữ liệu';
        });

        // Lấy thông tin member
        itemProject.projectTeamMemberDatas = [];
        let index = 1;
        itemProject.projectTeamMembers.forEach(memberId => {
            const itemUser = lstUser.find(q => q._id == memberId);
            if (itemUser == null) return;
            itemProject.projectTeamMemberDatas.push({
                index: index++,
                name: itemUser.fullName
            })
        });

        // lấy các thông tin khác cho project
        const itemStatus = lstStatus.find(q => q._id == itemProject.status);
        itemProject.statusName = itemStatus ? itemStatus.issueStatusName : 'Lỗi dữ liệu'

        const itemManager = lstUser.find(q => q._id == itemProject.projectManager);
        itemProject.projectManagerName = itemManager ? itemManager.fullName : 'Lỗi dữ liệu'
        res.render('projects/viewProject', viewData);
    }

    //[GET] /projects/create
    create(req, res, next) {
        Status.find({})
            .then(status => {
                User.find({})
                    .then(user => {
                        res.render('projects/detail', {
                            isFormAdd: true,
                            user: multipleMongooseToObject(user),
                            status: multipleMongooseToObject(status)
                        })
                    })
                    .catch(next);
            })
            .catch(next);

    }

    //[POST] /projects/store
    store(req, res, next) {
        const project = new Project(req.body);
        project.save()
            .then(() => res.redirect('/projects/list'))
            .catch(next);
    }

    //[GET] /projects/:id/edit
    async edit(req, res, next) {

        const itemProject = mongooseToObject(await Project.findById(req.params.id));
        if (itemProject.projectTeamMembers) {
            itemProject.strProjectTeamMembers = itemProject.projectTeamMembers.join('__');
        }
        const lstUser = multipleMongooseToObject(await User.find({}));
        const lstStatus = multipleMongooseToObject(await Status.find({}));
        const viewData = {
            isFormAdd: false,
            project: itemProject,
            user: lstUser,
            status: lstStatus
        };

        const itemSelected = lstUser.find(q => q._id == itemProject.projectManager);
        if (itemSelected) itemSelected.selected = true;

        const itemTypeSelected = lstStatus.find(q => q._id == itemProject.status);
        if (itemTypeSelected) itemTypeSelected.selected = true;

        res.render('projects/detail', viewData);
    }

    //[PUT] /projects/:id
    update(req, res, next) {
        Project.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/projects/list'))
            .catch(next);
    }

    //[DELETE] /projects/:id
    destroy(req, res, next) {
        Project.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /projects/:id/force
    forceDestroy(req, res, next) {
        Project.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[PATCH] /projects/:id/restore
    restore(req, res, next) {
        Project.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

}

module.exports = new ProjectController();