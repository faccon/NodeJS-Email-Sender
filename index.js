require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const cors = require("cors");
const http = require("http");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.engine("html", require("hogan-express"));
app.set("views", __dirname + "/views");
app.set("view engine", "html");

var inviteHTML = fs.readFileSync(__dirname + "/views/invite.html", "utf8");
var inviteTemplate = handlebars.compile(inviteHTML);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

app.get("/", (req, res) => {
  res.send("Email backend server is running");
});

app.post("/send/template/invite", (req, res) => {

  var sender = req.body.sender;
  var to = req.body.to;
  var recipient = req.body.recipient;
  var url = req.body.url;

  const options = {
    from: "teamCONNECT",
    to,
    subject: "Invitation to chat on teamCONNECT",
    html: inviteTemplate({ recipient, sender, url }),
  };

  transporter.sendMail(options, (err, info) => {
    var response = {};

    if (err) {
      response.status = "There was an error sending the email";
      response.status_code = 500;

      console.log(err);
      res.send(JSON.stringify(response));
    } else {
      response.status = "Email sent successfully";
      response.status_code = 200;

      console.log(info.response);
      res.send(JSON.stringify(response));
    }
  });
});

server.listen(PORT);
