import express, { type Express } from "express";
const app: Express = express();

app.get("/", (req, res, next) => {
  return res.status(200).send("OK");
});

export { app };
