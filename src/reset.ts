import { connectMongo, requestLogs } from "./mongo"

(async()=>{
    await connectMongo()
    const delRes = await requestLogs.deleteMany({})
    console.log(`${delRes.deletedCount} was deleted`)
})()