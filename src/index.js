require('dotenv').config();

const app = require('./app');
const { dbConnect } = require("../config/db");
const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await dbConnect();

    app.listen(port, () => {
      console.log(`TutorNest-edu Server is running : ${port}`);
    });
  } catch (err) {
    console.log("Failed to start server:", err);
  }
}

startServer();
