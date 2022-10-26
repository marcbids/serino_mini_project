const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/treasure", async (req, res) => {
  try {
    let result = await db.getAll(req.body);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

router.post("/highest", async (req, res) => {
  try {
    let result = await db.getNearHigh(req.body);
    res.json(result);
  } catch (e) {
    console.log(e);
    res.sendStatus(404);
  }
});

module.exports = router;
