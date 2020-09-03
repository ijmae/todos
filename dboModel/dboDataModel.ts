// {
//     "_id" : ObjectId("5f187e75113bcc53680871f2"),
//     "userId" : "1",
//     "jobGroups" : [
//             {
//                     "name" : "Việc 1",
//                     "jobs" : [
//                             {
//                                     "name" : "Ăn",
//                                     "isDone" : true
//                             },
//                             {
//                                     "name" : "Ngủ",
//                                     "isDone" : false
//                             }
//                     ]
//             }
//     ]
// }
import dataModel = require('../models/DataModel');
import fs = require('fs');
import mongodb = require('mongodb');
const ObjectID = mongodb.ObjectID;
const { DataModel, Job, JobGroup } = dataModel;
const MONGO_CLIENT = mongodb.MongoClient;
const URL = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:27017?ssl=true`;
const CONFIG = {
    useUnifiedTopology: true,
    sslValidate: true,
    checkServerIdentity: false,
    sslCA: [fs.readFileSync(__dirname + process.env.DB_CERTPATH)]
};

const DB_CLIENT = new MONGO_CLIENT(URL, CONFIG);

function handle(promise) {
    return promise
        .then(data => [data, undefined])
        .catch(err => Promise.resolve([undefined, err]))
}

export = function modelData() {
    const client = DB_CLIENT;

    return {
        getAll: async function () {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 200,
                data: null,
                err: null
            };

            const db = client.db(process.env.DB_NAME);
            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).find().toArray());

            if (result.err) {
                result.statusCode = 400;
            }
            return result;
        },

        getUser: async function (userId: string) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 200,
                data: null,
                err: null
            };

            const db = client.db(process.env.DB_NAME);
            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).find({ userId: userId }).project({ _id: 0 }).toArray());

            if (result.err) {
                result.statusCode = 400;
            }
            if (!result.data[0]) {
                result.statusCode = 404;
                result.err = 'userId is not found !';
            }
            result.data = result.data[0];

            return result;
        },

        getJobGroupById: async function (userId: string, jobGroupId: string) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = await this.getUser(userId);

            if (!result.err) {
                result.data = result.data.jobGroups;
                result.data = result.data.filter((jG) => jG._id.toHexString().toLowerCase() === jobGroupId.toLowerCase());
                result.data = result.data[0];
                if (!result.data) {
                    result.statusCode = 404;
                    result.err = 'jobGroupId is not found !';
                }
            }

            return result;
        },

        getJobById: async function (userId: string, jobGroupId: string, jobId: string) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = await this.getJobGroupById(userId, jobGroupId);

            if (!result.err) {
                result.data = result.data.jobs;
                result.data = result.data.filter((jG) => jG._id.toLowerCase() === jobId.toLowerCase());
                result.data = result.data[0];
                if (!result.data) {
                    result.statusCode = 404;
                    result.err = 'jobId is not found !';
                }
            }

            return result;
        },

        getJobGroupByIndex: async function (userId: string, jobGroupIndex?: number) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = await this.getUser(userId);

            if (!result.err) {
                result.data = result.data.jobGroups;
                if (jobGroupIndex !== undefined) {
                    result.data = result.data.filter((itm, idx) => idx === jobGroupIndex);
                    result.data = result.data[0];
                }
            }

            return result;
        },

        getJobByIndex: async function (userId: string, jobGroupIndex: number, jobIndex?: number) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = await this.getJobGroupByIndex(userId, jobGroupIndex);

            if (!result.err) {
                result.data = result.data.jobs;
                if (jobIndex !== undefined) {
                    result.data = result.data.filter((itm, idx) => idx === jobIndex);
                    result.data = result.data[0];
                }
            }

            return result;
        },

        isExistUser: async function (userId: string) {
            if (!client.isConnected()) {
                await client.connect();
            }
            let { data } = await this.getUser(userId);

            //Check available
            return !!data;
        },

        createUser: async function (userId: string, jobGroups?: any) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 201,
                data: null,
                err: null
            };

            //Check available
            if (await this.isExistUser(userId)) {
                result.statusCode = 409;
                result.err = 'userId is not available !';
                return result;
            }

            const db = client.db(process.env.DB_NAME);

            let insertData = new DataModel(userId);
            if (jobGroups !== undefined) {
                insertData.jobGroups = jobGroups;
            }

            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).insertOne(insertData));
            result.data = insertData;
            if (result.err) {
                result.statusCode = 500;
                result.data = null;
            }

            return result;
        },

        updateUser: async function (userId: string, { userId: newUserName = undefined, jobGroups: newJobGroups = undefined }) {
            if (!client.isConnected()) {
                await client.connect();
            }
            let result = {
                statusCode: 201,
                data: null,
                err: null
            };

            const db = client.db(process.env.DB_NAME);

            let updateData = {};
            (newUserName) ? updateData['userId'] = newUserName : '';
            (newJobGroups) ? updateData['jobGroups'] = newJobGroups : '';

            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).updateOne({ userId: userId }, { $set: updateData }));

            // result.data = result.data.value;

            if (result.err)
                result.statusCode = 500;

            return result;
        },

        deleteUser: async function (userId: string) {
            if (!client.isConnected()) {
                await client.connect();
            }
            let result = {
                statusCode: 204,
                data: null,
                err: null
            };

            const db = client.db(process.env.DB_NAME);

            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).findOneAndDelete({ userId: userId }));

            result.data = result.data.value;

            if (result.err)
                result.statusCode = 500;

            return result;
        },

        createJobGroup: async function (userId: string, jobGroupName: string, jobs?: any) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 201,
                data: null,
                err: null
            };

            //Check available
            if (!await this.isExistUser(userId)) {
                result.statusCode = 404;
                result.err = 'userId is not found !';
                return result;
            }

            const db = client.db(process.env.DB_NAME);

            let insertData = new JobGroup(jobGroupName);
            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).updateOne(
                { userId: userId },
                { $push: { jobGroups: insertData } }));
            result.data = insertData;
            if (result.err) {
                result.statusCode = 500;
                result.data = null;
            }
            return result;
        },

        updateJobGroupName: async function (userId: string, jobGroupId: string, newName: string) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 201,
                data: null,
                err: null
            };

            //Check available
            if (!await this.isExistUser(userId)) {
                result.statusCode = 404;
                result.err = 'userId is not found !';
                return result;
            }

            const db = client.db(process.env.DB_NAME);

            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).updateOne(
                { userId: userId },
                { $set: { "jobGroups.$[ele].name": newName } },
                { arrayFilters: [{ 'ele._id': new ObjectID(jobGroupId) }] }));
            result.data = result.data.result;
            if (result.err) {
                result.statusCode = 500;
                result.data = null;
            }
            return result;
        },

        deleteJobGroup: async function (userId: string, jobGroupId: string) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 201,
                data: null,
                err: null
            };

            //Check available
            if (!await this.isExistUser(userId)) {
                result.statusCode = 404;
                result.err = 'userId is not found !';
                return result;
            }

            const db = client.db(process.env.DB_NAME);

            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).updateOne(
                { userId: userId },
                { $pull: { jobGroups: { _id: new ObjectID(jobGroupId) } } }));
            result.data = result.data.result;
            if (result.err) {
                result.statusCode = 500;
                result.data = null;
            }
            return result;
        },

        createJob: async function (userId: string, jobGroupId: string, jobsName: string) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 201,
                data: null,
                err: null
            };

            //Check available
            if (!await this.isExistUser(userId)) {
                result.statusCode = 404;
                result.err = 'userId is not found !';
                return result;
            }

            const db = client.db(process.env.DB_NAME);

            let insertData = new Job(jobsName);
            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).updateOne(
                { userId: userId },
                { $push: { 'jobGroups.$[group].jobs': insertData } },
                { arrayFilters: [{ 'group._id': new ObjectID(jobGroupId) }] }));
            result.data = insertData;
            if (result.err) {
                result.statusCode = 500;
                result.data = null;
            }
            return result;
        },

        updateJob: async function (userId: string, jobGroupId: string, jobId: string, { name, isDone }: { name?: string, isDone?: boolean }) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 201,
                data: null,
                err: null
            };

            //Check available
            if (!await this.isExistUser(userId)) {
                result.statusCode = 404;
                result.err = 'userId is not found !';
                return result;
            }

            const db = client.db(process.env.DB_NAME);

            let json = {};
            if (name) {
                json["jobGroups.$[group].jobs.$[job].name"] = name;
            }
            if (isDone !== undefined) {
                json["jobGroups.$[group].jobs.$[job].isDone"] = isDone;
            }

            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).updateOne(
                { userId: userId },
                { $set: json },
                {
                    arrayFilters: [
                        { 'group._id': new ObjectID(jobGroupId) },
                        { 'job._id': new ObjectID(jobId) }
                    ]
                }));
            result.data = result.data.result;
            if (result.err) {
                result.statusCode = 500;
                result.data = null;
            }
            return result;
        },

        deleteJob: async function (userId: string, jobGroupId: string, jobId: string) {
            if (!client.isConnected()) {
                await client.connect();
            }

            let result = {
                statusCode: 201,
                data: null,
                err: null
            };

            //Check available
            if (!await this.isExistUser(userId)) {
                result.statusCode = 404;
                result.err = 'userId is not found !';
                return result;
            }

            const db = client.db(process.env.DB_NAME);

            [result.data, result.err] = await handle(db.collection(process.env.DB_COLLECTION_DATA).updateOne(
                { userId: userId },
                { $pull: { 'jobGroups.$[group].jobs': { _id: new ObjectID(jobId) } } },
                {
                    arrayFilters: [
                        { 'group._id': new ObjectID(jobGroupId) }
                    ]
                }));
            result.data = result.data.result;
            if (result.err) {
                result.statusCode = 500;
                result.data = null;
            }
            return result;
        },

        disconnect: () => client.close()
    }
}