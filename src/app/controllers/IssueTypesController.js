const IssueType = require('../models/IssueType');
const slug = require('mongoose-slug-generator');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class IssueTypeController {
    //[GET] /issueTypes/show (issueType list)
    show(req, res, next) {
        const searchObj = {};
        const searchData = {};
        if (req.body.q) {
            searchObj.issueTypeName = { '$regex': req.body.q, '$options': 'i' };
            searchData.q = req.body.q;
        }
        IssueType.find(searchObj)
            .then(issueType => {
                res.render('issueTypes/show', {
                    issueType: multipleMongooseToObject(issueType),
                    search: searchData
                })
            })
            .catch(next);
    }


    //[GET] /issueTypes/create
    create(req, res, next) {
        res.render('issueTypes/detail', {
            isFormAdd: true
        });

    }

    //[POST] /issueTypes/store
    store(req, res, next) {
        const issueType = new IssueType(req.body);
        issueType.save()
            .then(() => res.redirect('/issueTypes/list'))
            .catch(next);
    }

    //[GET] /issueTypes/:id/edit
    edit(req, res, next) {
        IssueType.findById(req.params.id)
            .then(issueType => {
                res.render('issueTypes/detail', {
                    isFormAdd: false,
                    issueType: mongooseToObject(issueType)
                });
            })
            .catch(next);

    }

    //[PUT] /issueTypes/:id
    update(req, res, next) {
        IssueType.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/issueTypes/list'))
            .catch(next);
    }

    //[DELETE] /issueTypes/:id
    destroy(req, res, next) {
        IssueType.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /issueTypes/:id/force
    forceDestroy(req, res, next) {
        IssueType.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[PATCH] /issueTypes/:id/restore
    restore(req, res, next) {
        IssueType.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


}


module.exports = new IssueTypeController();