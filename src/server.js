import nodemailer from "nodemailer";
import "dotenv/config";
import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

let emailTemplate = "";

fs.readFile(
  __dirname + "/resources/email-template.html",
  "utf8",
  function (err, data) {
    if (err) throw err;
    emailTemplate = data;
  }
);

var transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    user: process.env.OUTLOOK_USERNAME,
    pass: process.env.OUTLOOK_PASSWORD,
  },
});

const app = express();
app.use(express.json());

app.post("/email", async (req, res) => {
  const { to, name } = req.body;
  var mailOptions = {
    from: `"Nathan Drake" <${process.env.OUTLOOK_USERNAME}>`, // sender address (who sends)
    to, // list of receivers (who receives)
    subject: "Hello", // Subject line
    text: "Hello world", // plaintext body
    html: emailTemplate.replace("{{name}}", name), // html body
  };

  // send mail with defined transport object
  try {
    const response = await transporter.sendMail(mailOptions);
    res.status(200).send({
      message: "enviou o email!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "ERRO - não enviou o email!",
    });
  }
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Listening to port ${port}...`);
});
