const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    console.log("data:", data);
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    const { id, content, postId, status } = data;
    console.log("post", posts, "id", id);
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    let comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
    console.dir(posts, { depth: null });
  }
};

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  res.send({});
});

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.listen(4002, async () => {
  try {
    console.log("Listening on 4002");
    const res = await axios.get("http://localhost:4005/events");
    for (let event of res.data) {
      console.log("processing Event", event.type);
      handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log("err:", err);
  }
});
