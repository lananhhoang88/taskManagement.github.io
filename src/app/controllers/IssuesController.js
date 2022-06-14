const Issue = require('../models/Issue');
const User = require('../models/User');
const Status = require('../models/IssueStatus');
const Type = require('../models/IssueType');
const Category = require('../models/Category');
const Priority = require('../models/PriorityLevel');
const Project = require('../models/Project');
const Comment = require('../models/Comments');
const File = require('../models/File');
const { GetUserInfo } = require('./../../util/auth');
const { v4: uuidv4 } = require('uuid');
const { mongooseToObject } = require('../../util/mongoose');
const { multipleMongooseToObject } = require('../../util/mongoose');


class IssueController {
    //[GET] /issues/show (list issue)
    async show(req, res, next) {
        const searchObj = {};
        const searchData = {};
        if (req.body.q) {
            searchObj.subject = { '$regex': req.body.q, '$options': 'i' };
            searchData.q = req.body.q;
        }
        if (req.body.watching == 'on') {
            const userCurrent = GetUserInfo(req);
            searchObj.watcher = userCurrent._id;
            searchData.watchOn = true;
        }
        const lstItem = multipleMongooseToObject(await Issue.find(searchObj));
        const viewData = {
            issue: lstItem,
            search: searchObj
        };
        const [
            lstProject,
            lstStatus
        ] = await Promise.all([
            Project.find({}),
            Status.find({})
        ]);
        lstItem.forEach(item => {
            const itemProject = lstProject.find(q => q._id == item.project);
            if (itemProject) item.projectName = itemProject.projectName;
            else item.projectName = 'Lỗi dữ liệu';

            const itemStatus = lstStatus.find(q => q._id == item.status);
            if (itemStatus) item.statusName = itemStatus.issueStatusName;
            else item.statusName = 'Lỗi dữ liệu';
        });
        res.render('issues/show', viewData);
    }

    //[GET] /users/show/:slug (show a user)
    async showIssue(req, res, next) {
        const issue = mongooseToObject(await Issue.findOne({ id: req.params.slug }));
        const viewData = {
            issue,
            lstComment: [],
            originalUrl: req.originalUrl
        };

        const [
            lstProject,
            lstStatus,
            lstUser,
            lstCategory,
            lstType,
            lstPriority,
        ] = await Promise.all([
            Project.find({}),
            Status.find({}),
            User.find({}),
            Category.find({}),
            Type.find({}),
            Priority.find({}),
        ]);

        const fileData = await File.findOne({ id: issue.attachment });
        if (fileData)
            viewData.issue.attachmentName = fileData.name;

        const itemProject = lstProject.find(q => q._id == issue.project);
        issue.projectName = itemProject ? itemProject.projectName : 'Lỗi dữ liệu'

        const itemStatus = lstStatus.find(q => q._id == issue.status);
        issue.statusName = itemStatus ? itemStatus.issueStatusName : 'Lỗi dữ liệu'

        const itemPriority = lstPriority.find(q => q._id == issue.priority);
        issue.priorityName = itemPriority ? itemPriority.priorityLevelName : 'Lỗi dữ liệu'

        const itemCategory = lstCategory.find(q => q._id == issue.category);
        issue.categoryName = itemCategory ? itemCategory.categoryName : 'Lỗi dữ liệu'

        const itemType = lstType.find(q => q._id == issue.issueType);
        issue.typeName = itemType ? itemType.issueTypeName : 'Lỗi dữ liệu'

        const itemUser = lstUser.find(q => q._id == issue.assignee);
        issue.assigneeName = itemUser ? itemUser.fullName : 'Lỗi dữ liệu'

        if (issue) {
            const lstComment = multipleMongooseToObject(
                await Comment.find({ itemId: issue.id })
            );
            const lstIdAvatar = [];
            lstComment.forEach(comment => {
                const itemUser = lstUser.find(q => q._id == comment.idUser);
                if (itemUser == null) return;
                comment.fullName = itemUser.fullName;
                if (!itemUser.avatar) {
                    comment.avatar = 'avatar.png';
                }
                if (lstIdAvatar.indexOf(itemUser.avatar) == -1)
                    lstIdAvatar.push(itemUser.avatar);
            });

            const lstFile = await File.find({ id: lstIdAvatar });
            lstComment.forEach(comment => {
                const itemUser = lstUser.find(q => q._id == comment.idUser);
                if (itemUser == null) return;
                if (comment.avatar) return;
                const itemFile = lstFile.find(q => q.id == itemUser.avatar);
                if (!itemFile) return;
                comment.avatar = itemFile.path;
            });
            viewData.lstComment = lstComment;
        }

        // Kiểm tra người dùng có đang watching issue
        const userCurrent = GetUserInfo(req);
        if (issue.watcher && issue.watcher.indexOf(userCurrent._id) > -1) {
            issue.watched = true;
        }
        res.render('issues/viewIssue', viewData);

    }

    //[GET] /issues/create
    async create(req, res, next) {
        const allRequest = [];
        // get all status
        allRequest.push(Status.find({}));
        // ...
        allRequest.push(Category.find({}));
        // ...
        allRequest.push(Type.find({}));
        // ...
        allRequest.push(Priority.find({}));
        // ...
        allRequest.push(User.find({}));
        // ...
        allRequest.push(Project.find({}));

        const [
            lstStatus,
            lstCategory,
            lstType,
            lstPriority,
            lstUser,
            lstProject
        ] = await Promise.all(allRequest).catch(next);

        var result = {
            isFormAdd: true,
            project: multipleMongooseToObject(lstProject),
            priority: multipleMongooseToObject(lstPriority),
            assignee: multipleMongooseToObject(lstUser),
            status: multipleMongooseToObject(lstStatus),
            category: multipleMongooseToObject(lstCategory),
            type: multipleMongooseToObject(lstType)
        };

        res.render('issues/detail', result)
    }

    //[POST] /issues/store
    async store(req, res, next) {
        const issue = new Issue(req.body, res.file);
        if (req.body.attachment) {
            // Lưu file vào database
            const itemFile = new File();
            const objFileInReq = JSON.parse(req.body.attachment);
            itemFile.id = uuidv4();
            itemFile.name = objFileInReq.originalname;
            itemFile.path = objFileInReq.filename;
            itemFile.created = new Date();
            await itemFile.save();
            issue.attachment = itemFile.id;
        }
        issue.id = uuidv4();
        issue.save()
            .then(() => res.redirect('/issues/list'))
            .catch(next);
    }

    //[GET] /issues/:id/edit
    async edit(req, res, next) {
        const allRequest = [];
        // get metadata issue
        allRequest.push(Issue.findById(req.params.id));
        // get all status
        allRequest.push(Status.find({}));
        // ...
        allRequest.push(Category.find({}));
        // ...
        allRequest.push(Type.find({}));
        // ...
        allRequest.push(Priority.find({}));
        // ...
        allRequest.push(User.find({}));
        // ...
        allRequest.push(Project.find({}));

        const allResponse = await Promise.all(allRequest).catch(next);
        const itemEdit = mongooseToObject(allResponse[0]);
        // Mấy cái danh mục này e lấy lại nhiều đúng k, có thể viết ra 1 hàm riêng nữa nè
        const lstStatus = multipleMongooseToObject(allResponse[1]);
        const lstCategory = multipleMongooseToObject(allResponse[2]);
        const lstType = multipleMongooseToObject(allResponse[3]);
        const lstPriority = multipleMongooseToObject(allResponse[4]);
        const lstUser = multipleMongooseToObject(allResponse[5]);
        const lstProject = multipleMongooseToObject(allResponse[6]);

        // Set selected project
        const itemSelected = lstProject.find(q => q._id == itemEdit.project);
        if (itemSelected) itemSelected.selected = true;

        // Set selected type
        const itemTypeSelected = lstType.find(q => q._id == itemEdit.issueType);
        if (itemTypeSelected) itemTypeSelected.selected = true;

        const itemStatusSelected = lstStatus.find(q => q._id == itemEdit.status);
        if (itemStatusSelected) itemStatusSelected.selected = true;

        var result = {
            isFormAdd: false,
            issue: itemEdit,
            project: lstProject,
            priority: lstPriority,
            assignee: lstUser,
            status: lstStatus,
            category: lstCategory,
            type: lstType
        };

        // Lấy thông tin file đính kèm
        const fileData = await File.findOne({ id: itemEdit.attachment });
        if (fileData)
            result.issue.attachmentName = fileData.name;

        res.render('issues/detail', result)
    }

    //[PUT] /issues/:id
    async update(req, res, next) {
        const updateData = { ...req.body };
        delete updateData._id;
        if (req.body.attachment) {
            // Lưu file vào database
            const itemFile = new File();
            const objFileInReq = JSON.parse(req.body.attachment);
            itemFile.id = uuidv4();
            itemFile.name = objFileInReq.originalname;
            itemFile.path = objFileInReq.filename;
            itemFile.created = new Date();
            await itemFile.save();
            updateData.attachment = itemFile.id;
        }
        Issue.updateOne({ _id: req.params.id }, updateData)
            .then(() => res.redirect('/issues/list'))
            .catch(next);
    }

    //[DELETE] /issues/:id
    destroy(req, res, next) {
        Issue.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /issues/:id/force
    forceDestroy(req, res, next) {
        Issue.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[PATCH] /issues/:id/restore
    restore(req, res, next) {
        Issue.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    /**
     * Hàm comment
     */
    comment(req, res, next) {
        const user = GetUserInfo(req);
        // TODO: Lưu comment vào database
        const comment = new Comment();
        comment.itemId = req.body.itemId;
        comment.idUser = user._id;
        comment.content = req.body.inputComment;
        comment.created = new Date();
        comment.save();
        // Redirect về trang cũ để hiển thị comment mới nhất
        // Làm như này nó sẽ bị giật lag nhưng dc cái sẽ luôn mới nhất
        res.redirect(req.body.originalUrl);
    }

    /**
     * Hàm watch
     */
    async watch(req, res, next) {
        const user = GetUserInfo(req);
        const issueId = req.params.id;
        const itemIssue = mongooseToObject(await Issue.findOne({ id: issueId }));
        if (!itemIssue.watcher) itemIssue.watcher = [];
        if (itemIssue.watcher.indexOf(user._id) == -1)
            itemIssue.watcher.push(user._id);
        await Issue.updateOne({ id: issueId }, itemIssue);
        res.json({
            success: true,
        });
    }

    /**
     * Hàm unwatch
     */
    async unwatch(req, res, next) {
        const user = GetUserInfo(req);
        const issueId = req.params.id;
        const itemIssue = mongooseToObject(await Issue.findOne({ id: issueId }));
        if (!itemIssue.watcher) itemIssue.watcher = [];
        const index = itemIssue.watcher.indexOf(user._id);
        if (index > -1)
            itemIssue.watcher.splice(index, 1);
        await Issue.updateOne({ id: issueId }, itemIssue);
        res.json({
            success: true,
        });
    }
}

module.exports = new IssueController();