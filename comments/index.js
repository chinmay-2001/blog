const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentsId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentsId, content });
  commentsByPostId[req.params.id] = comments;

  await axios
    .post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentsId,
        content,
        postId: req.params.id,
      },
    })
    .catch((err) => {
      console.log("err:", err);
    });
  res.status(201).send(comments);
});
app.post("/events", (req, res) => {
  console.log("Received Event:", req.body.type);
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
