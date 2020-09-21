"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObjectID = require('mongodb').ObjectID;
class Job {
    constructor(name, isDone = false) {
        this._id = new ObjectID();
        this.name = name;
        this.isDone = isDone;
    }
    factory(name, isDone) {
        return new Job(name, isDone);
    }
}
class JobGroup {
    constructor(name, jobs = []) {
        this._id = new ObjectID();
        this.name = name;
        this.jobs = jobs;
    }
    factory(name, jobs) {
        return new JobGroup(name, jobs);
    }
}
class DataModel {
    constructor(userId, jobGroups = []) {
        this.userId = userId;
        this.jobGroups = jobGroups;
    }
    factory(userId, jobGroups) {
        return new DataModel(userId, jobGroups);
    }
}
module.exports = {
    DataModel: DataModel,
    JobGroup: JobGroup,
    Job: Job
};
