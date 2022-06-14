const Issue = require('../models/Issue');
const Status = require('../models/IssueStatus');
const IssueType = require('../models/IssueType');
const Category = require('../models/Category');
const { multipleMongooseToObject } = require('../../util/mongoose');

class ReportController {

    //[GET] /
    gantt(req, res, next) {
        Issue.find({})
            .then(issue => {
                res.render('reports/gantt', {
                    issue: multipleMongooseToObject(issue)
                })
            })
            .catch(next);

    }

    index(req, res, next) {
        Issue.find({ status: 'On-Progress' })
            .then(issue => {
                res.render('reports/report', {
                    issue: multipleMongooseToObject(issue)
                })
            })
            .catch(next);

    }

    // async board(req, res, next) {
    board = async (req, res, next) => {
        const searchObj = {};
        const searchData = {};
        // Append điều kiện tìm kiếm theo tên issue
        if (req.body.q) {
            searchObj.subject = { '$regex': req.body.q, '$options': 'i' };
            searchData.q = req.body.q;
        }

        // Append điều kiện tìm kiếm theo tên issue type
        if (req.body.issueType) {
            searchObj.issueType = req.body.issueType;
            searchData.issueType = req.body.issueType;
        }

        // Append điều kiện tìm kiếm theo tên issue status
        if (req.body.status) {
            searchObj.status = req.body.status;
            searchData.status = req.body.status;
        }

        // Append điều kiện tìm kiếm theo tên issue category
        if (req.body.category) {
            searchObj.category = req.body.category;
            searchData.category = req.body.category;
        }

        const lstStatus = multipleMongooseToObject(await Status.find({
            issueStatusName: [
                'In Progress',
                'Open',
                'Done',
                'Overdue'
            ]
        }));
        const itemStatusInProgress = lstStatus.find(q => q.issueStatusName == 'In Progress') ?? {};
        const itemStatusOpen = lstStatus.find(q => q.issueStatusName == 'Open') ?? {};
        const itemStatusDone = lstStatus.find(q => q.issueStatusName == 'Done') ?? {};
        const itemStatusOverdue = lstStatus.find(q => q.issueStatusName == 'Overdue') ?? {};
        const [
            issueOpen, issueInProgress, issueDone, issueOverdue,
            lstIssueType, lstCategory
        ] = await Promise.all([
            Issue.find({ status: itemStatusOpen._id, ...searchObj }),
            Issue.find({ status: itemStatusInProgress._id, ...searchObj }),
            Issue.find({ status: itemStatusDone._id, ...searchObj }),
            Issue.find({ status: itemStatusOverdue._id, ...searchObj }),
            IssueType.find({}),
            Category.find({})

        ]);

        const viewData = {
            search: searchData,
            issueOpen: multipleMongooseToObject(issueOpen),
            issueInProgress: multipleMongooseToObject(issueInProgress),
            issueDone: multipleMongooseToObject(issueDone),
            issueOverdue: multipleMongooseToObject(issueOverdue),
            lstIssueType: multipleMongooseToObject(lstIssueType),
            lstCategory: multipleMongooseToObject(lstCategory),
            lstStatus
            
        };

        this.setNameIssueType(viewData.issueOpen, lstIssueType);
        this.setNameIssueType(viewData.issueInProgress, lstIssueType);
        this.setNameIssueType(viewData.issueDone, lstIssueType);
        this.setNameIssueType(viewData.issueOverdue, lstIssueType);

        viewData.totalIssueOpen = viewData.issueOpen.length;
        viewData.totalIssueInProgress = viewData.issueInProgress.length;
        viewData.totalIssueDone = viewData.issueDone.length;
        viewData.totalIssueOverdue = viewData.issueOverdue.length;
        res.render('reports/board', viewData)
    }

    setNameIssueType(lstIssue, lstIssueType) {
        lstIssue.forEach(issue => {
            const itemIssueType = lstIssueType.find(q => q._id == issue.issueType);
            if (itemIssueType == null) return;
            issue.issueTypeName = itemIssueType.issueTypeName;
        });
    }
}

module.exports = new ReportController;