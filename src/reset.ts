import { connectMongo, requestHistorys, requestTransfers, requestUsers } from "./mongo"

(async()=>{
    await connectMongo()
    await requestUsers.deleteMany({});
    await requestHistorys.deleteMany({});
    await requestTransfers.deleteMany({});
    console.log('deleted success');
})()