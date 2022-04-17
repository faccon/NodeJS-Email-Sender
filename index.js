require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const http = require("http");

const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node server is running");
});

// const options = {
//   from: 'babdevs@outlook.com',
//   to: 'babdevs@outlook.com',
//   subject: "hi",
//   text: "hi",
// };

// transporter.sendMail(options, (err, info) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(info.response);
//   }

app.post("/", (req, res) => {
  const options = req.body;

  transporter.sendMail(options, (err, info) => {
    if (err) {
      response = "There was an error sending the email";
      console.log(err);
      res.send(response);
    } else {
      response = "Email sent successfully";
      console.log(info.response);
      res.send(response);
    }
  });
});

server.listen(PORT, () => {
  console.log("====================================");
  console.log(`Server is running on port:  http://localhost:${PORT}`);
  console.log("====================================");
});
