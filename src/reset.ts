import { connectMongo, requestUsers } from "./mongo"

(async()=>{
    await connectMongo()
    const delRes = await requestUsers.deleteMany({})
    console.log(`${delRes.deletedCount} was deleted`)
})()