const express = require("express");
const cors = require("cors");
const apiRouter = require("./server/routes");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/kitra", apiRouter);

app.listen(port, () => {
  console.log(`App is running on port : ${port}`);
});
