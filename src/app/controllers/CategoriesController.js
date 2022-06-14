const Category = require('../models/Category');
const slug = require('mongoose-slug-generator');
const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class CategoryController {
    //[GET] /categories/show (category list)
    show(req, res, next) {
        const searchObj = {};
        const searchData = {};
        if (req.body.q) {
            searchObj.categoryName = { '$regex': req.body.q, '$options': 'i' };
            searchData.q = req.body.q;
        }
        Category.find(searchObj)
            .then(category => {
                res.render('categories/show', {
                    category: multipleMongooseToObject(category),
                    search: searchData
                })
            })
            .catch(next);

    }
    //[GET] /categories/show/:slug (show a category)
    showCategory(req, res, next) {
        Category.findOne({ slug: req.params.slug })
            .then(category => {
                res.render('categories/viewCategory', { category: mongooseToObject(category) })
            })
            .catch(next);

    }

    //[GET] /categories/create
    create(req, res, next) {
        res.render('categories/detail', {
            isFormAdd: true
        });

    }

    //[POST] /categories/store
    store(req, res, next) {
        const category = new Category(req.body);
        category.save()
            .then(() => res.redirect('/categories/list'))
            .catch(next);
    }

    //[GET] /categories/:id/edit
    edit(req, res, next) {
        Category.findById(req.params.id)
            .then(category => {
                res.render('categories/detail', {
                    isFormAdd: false,
                    category: mongooseToObject(category)
                });
            })
            .catch(next);

    }

    //[PUT] /categories/:id
    update(req, res, next) {
        Category.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/categories/list'))
            .catch(next);
    }

    //[DELETE] /categories/:id
    destroy(req, res, next) {
        Category.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[DELETE] /categories/:id/force
    forceDestroy(req, res, next) {
        Category.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[PATCH] /categories/:id/restore
    restore(req, res, next) {
        Category.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


}


module.exports = new CategoryController();