const { MongoClient } = require("mongodb");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const json2csvParser = new Json2csvParser({ header: true });
// Replace the uri string with your connection string.
const uri =
  "mongodb+srv://user_dtds_project:user_dtds_project@cluster0.agqtn0k.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("test");

    const thirtydays = database.collection("thirtydaydatas");
    const fiveyear = database.collection("fiveyeardatas");

    const data = await fiveyear.find({}).toArray((err, data) => {
      if (err) throw err;

      console.log(data);
      client.close();
    });

    const data2 = await thirtydays.find({}).toArray((err, data) => {
      if (err) throw err;

      console.log(data2);
      client.close();
    });

    const csvDataFive = json2csvParser.parse(data);
    const csvDataThirty = json2csvParser.parse(data2);

    fs.writeFile("fiveyearsdatas.csv", csvDataFive, function (error) {
      if (error) throw error;
      console.log("Write to fiveyearsdatas.csv successfully!");
    });

    fs.writeFile("thirtydaysdatas.csv", csvDataThirty, function (error) {
      if (error) throw error;
      console.log("Write to thirtydaysdatas.csv successfully!");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
