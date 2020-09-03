const ObjectID = require('mongodb').ObjectID;

class Job {
    _id: any;
    name: string;
    isDone: boolean;

    constructor(name: string, isDone: boolean = false) {
        this._id = new ObjectID();
        this.name = name;
        this.isDone = isDone;
    }
    factory(name: string, isDone: boolean) {
        return new Job(name, isDone);
    }
}
class JobGroup {
    _id: any;
    name: string;
    jobs: Job[];

    constructor(name: string, jobs: Job[] = []) {
        this._id = new ObjectID();
        this.name = name;
        this.jobs = jobs;
    }
    factory(name: string, jobs: Job[]) {
        return new JobGroup(name, jobs);
    }
}
class DataModel {
    userId: string;
    jobGroups: JobGroup[];

    constructor(userId: string, jobGroups: JobGroup[] = []) {
        this.userId = userId;
        this.jobGroups = jobGroups;
    }
    factory(userId: string, jobGroups: JobGroup[]) {
        return new DataModel(userId, jobGroups);
    }
}

export = {
    DataModel: DataModel,
    JobGroup: JobGroup,
    Job: Job
};
