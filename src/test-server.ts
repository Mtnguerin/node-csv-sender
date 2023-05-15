import express from "express";
const app = express();
app.use(express.json());
app.get("*", (req, res) => {
  res.sendStatus(404);
});
app.post("/api/rows", (req, res) => {
  const rows = req.body;
  console.log("Received rows:");
  console.log(rows);
  res.sendStatus(200);
});
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
