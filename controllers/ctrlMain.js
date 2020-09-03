"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _dboDataModel = require("../dboModel/dboDataModel");
const _DataModel = require("../models/DataModel");
const bodyParse = require("body-parser");
const urlencodedParse = bodyParse.urlencoded({ extended: false });
const jsonParse = bodyParse.json();
const dboDataModel = _dboDataModel();
const { DataModel, JobGroup, Job } = _DataModel;
module.exports = function (app) {
    app.get('/', async function (req, res) {
        let result = (await dboDataModel.getUser('Nghia')).data;
        res.render('index', { jobGroups: result.jobGroups, title: 'todo' });
    });
    app.post('/user', jsonParse, async function (req, res) {
        if (req.body.jobGroupName === '') {
            res.status(404).json({ error: "JobGroupName must be not empty !" });
            return;
        }
        let result = (await dboDataModel.createJobGroup('Nghia', req.body.jobGroupName));
        res.status(result.statusCode).json(result);
    });
    app.put('/user/:jobGroupId', jsonParse, async function (req, res) {
        let result = (await dboDataModel.updateJobGroupName('Nghia', req.params.jobGroupId, req.body.name));
        res.status(result.statusCode).json(result);
    });
    app.delete('/user/:jobGroupId', jsonParse, async function (req, res) {
        let result = (await dboDataModel.deleteJobGroup('Nghia', req.params.jobGroupId));
        res.status(result.statusCode).json(result);
    });
    app.post('/user/:jobGroupId', jsonParse, async function (req, res) {
        if (req.body.jobName === '') {
            res.status(404).json({ error: "JobName must be not empty !" });
            return;
        }
        let result = (await dboDataModel.createJob('Nghia', req.params.jobGroupId, req.body.jobName));
        res.status(result.statusCode).json(result);
    });
    app.put('/user/:jobGroupId/job/:jobId', jsonParse, async function (req, res) {
        let result = (await dboDataModel.updateJob('Nghia', req.params.jobGroupId, req.params.jobId, req.body));
        res.status(result.statusCode).json(result);
    });
    app.delete('/user/:jobGroupId/job/:jobId', jsonParse, async function (req, res) {
        let result = (await dboDataModel.deleteJob('Nghia', req.params.jobGroupId, req.params.jobId));
        res.status(result.statusCode).json(result);
    });
};
