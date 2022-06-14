const PriorityLevel = require('../models/PriorityLevel');
const slug = require('mongoose-slug-generator');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class PriorityLevelController {
    //[GET] /priorityLevels/show (priorityLevel list)
    show(req, res, next) {
        const searchObj = {};
        const searchData = {};
        if (req.body.q) {
            searchObj.priorityLevelName = { '$regex': req.body.q, '$options': 'i' };
            searchData.q = req.body.q;
        }
        debugger;
        PriorityLevel.find(searchObj)
            .then(priorityLevel => {
                res.render('priorityLevels/show', {
                    priorityLevel: multipleMongooseToObject(priorityLevel),
                    search: searchData
                })
            })
            .catch(next);

    }

    //[GET] /priorityLevels/create
    create(req, res, next) {
        res.render('priorityLevels/detail', {
            isFormAdd: true
        });

    }

    //[POST] /priorityLevels/store
    store(req, res, next) {
        const priorityLevel = new PriorityLevel(req.body);
        priorityLevel.save()
            .then(() => res.redirect('/priorityLevels/list'))
            .catch(next);
    }

    //[GET] /priorityLevels/:id/edit
    edit(req, res, next) {
        PriorityLevel.findById(req.params.id)
            .then(priorityLevel => {
                res.render('priorityLevels/detail', {
                    isFormAdd: false,
                    priorityLevel: mongooseToObject(priorityLevel)
                });
            })
            .catch(next);

    }

    //[PUT] /priorityLevels/:id
    update(req, res, next) {
        PriorityLevel.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/priorityLevels/list'))
            .catch(next);
    }

    //[DELETE] /priorityLevels/:id
    destroy(req, res, next) {
        PriorityLevel.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /priorityLevels/:id/force
    forceDestroy(req, res, next) {
        PriorityLevel.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[PATCH] /priorityLevels/:id/restore
    restore(req, res, next) {
        PriorityLevel.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


}


module.exports = new PriorityLevelController();