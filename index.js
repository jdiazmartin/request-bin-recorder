const express = require("express");
const app = express();
const port = 3000;

const { v4: uuidv4 } = require('uuid');

const {JSONPath} = require('jsonpath-plus');
const ttl = 24*60*60;
const myCache = new NodeCache({ stdTTL: ttl });

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
    let webhooks = Object.values(myCache.mget(myCache.keys()));
    const filter = req.query.filter;
    if(filter){
        webhooks = JSONPath({path: filter, json: webhooks});
    }

    res.json(webhooks);
});

app.post("/", (req, res) => {
    const webhook = { headers: req.headers, body:req.body };
    myCache.set(uuidv4(), webhook);
    res.json(webhook);
  });

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});