const express = require("express");
const apiRouter = require("./server/routes");

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/kitra", apiRouter);

app.listen(port, () => {
  console.log(`App is running on port : ${port}`);
});
