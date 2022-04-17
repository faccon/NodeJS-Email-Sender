require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const http = require("http");
const fs = require("fs");

const PORT = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);

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
  res.send("Node server is running");
});

app.get("/preview", (req, res) => {
  res.render("invite", { firstname: "John" });
});

app.post("/", (req, res) => {
  var sender = req.body.sender;
  var recipient = req.body.recipient;
  var url = req.body.url;

  const options = {
    from: "Babdev nodejs email sender",
    to: "adeniyi.germany@gmail.com",
    subject: "Invitation to chat on teamCONNECT",
    html: inviteTemplate({ recipient, sender, url }),
  };

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
