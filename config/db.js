const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@tutornestcluster.hdsm890.mongodb.net/?appName=TutorNestCluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const isValidObjectId = (id) => ObjectId.isValid(id) && String(new ObjectId(id)) === id;


async function dbConnect() {
  try {
    await client.connect();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
}

module.exports={
    client,
    dbConnect,
    isValidObjectId
}