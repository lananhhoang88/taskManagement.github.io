const IssueStatus = require('../models/IssueStatus');
const slug = require('mongoose-slug-generator');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class IssueStatusController {
    //[GET] /issueStatuses/show (issueStatus list)
    show(req, res, next) {
        const searchObj = {};
        const searchData = {};
        if (req.body.q) {
            searchObj.issueStatusName = { '$regex': req.body.q, '$options': 'i' };
            searchData.q = req.body.q;
        }
        IssueStatus.find(searchObj)
            .then(issueStatus => {
                res.render('issueStatuses/show', {
                    issueStatus: multipleMongooseToObject(issueStatus),
                    search: searchData
                })
            })
            .catch(next);

    }
    //[GET] /issueStatuses/show/:slug (show a issueStatus)
    showIssueStatus(req, res, next) {
        IssueStatus.findOne({ slug: req.params.slug })
            .then(issueStatus => {
                res.render('issueStatuses/viewIssueStatus', { issueStatus: mongooseToObject(issueStatus) })
            })
            .catch(next);

    }

    //[GET] /issueStatuses/create
    create(req, res, next) {
        res.render('issueStatuses/detail', {
            isFormAdd: true
        });
    }

    //[POST] /issueStatuses/store
    store(req, res, next) {
        const issueStatus = new IssueStatus(req.body);
        issueStatus.save()
            .then(() => res.redirect('/issueStatuses/list'))
            .catch(next);
    }

    //[GET] /issueStatuses/:id/edit
    edit(req, res, next) {
        IssueStatus.findById(req.params.id)
            .then(issueStatus => {
                res.render('issueStatuses/detail', {
                    isFormAdd: false,
                    issueStatus: mongooseToObject(issueStatus)
                });
            })
            .catch(next);

    }

    //[PUT] /issueStatuses/:id
    update(req, res, next) {
        IssueStatus.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/issueStatuses/list'))
            .catch(next);
    }

    //[DELETE] /issueStatuses/:id
    destroy(req, res, next) {
        IssueStatus.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /issueStatuses/:id/force
    forceDestroy(req, res, next) {
        IssueStatus.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[PATCH] /issueStatuses/:id/restore
    restore(req, res, next) {
        IssueStatus.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


}


module.exports = new IssueStatusController();