const functions = require("firebase-functions");
const express = require("express");

const cors = require("cors");
const path = require("path");
const mailer = require("./src/lib/mailer");

const app = express();

/* Middlewares */
const {
  validateFirebaseIdToken,
} = require("./src/middlewares/loggin.middleware");
const {
  handleErrors,
} = require("./src/middlewares/errorHandler.middleware");

let allowedOrigins = [
  "https://share-it-rust.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        console.log("NO CORS");
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
  // cors()
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  return res.json({ message: "서버 동작중" });
});

app.use(validateFirebaseIdToken);

/**
 * 메일링
 */
app.post("/sendMail", async (req, res, next) => {
  const {
    email_receiver: emailReceiver,
    post_title: postTitle,
    username,
    comment,
    link_to_post: linkToPost,
  } = req.body;

  functions.logger.log({
    emailReceiver,
    postTitle,
    username,
    comment,
    linkToPost,
  });

  await mailer({
    emailReceiver,
    title: `[Share it!] "${postTitle}" 에 ${username}님이 댓글을 다셨습니다.`,
    content: `
    <h2>"${postTitle}" 에 ${username}님이 댓글을 다셨습니다.</h2>
    <p>댓글 내용: ${comment}</p>
    <p>
      바로 가기: <a href="${linkToPost}" target="_blank">${linkToPost}</a>
    </p>`,
  });
  return res
    .status(200)
    .json({ message: "이메일 전송 성공" });
});

app.use(handleErrors);

exports.app = functions.https.onRequest(app);
