const nodemailer = require("nodemailer");
const { env } = require("../constants");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const _ = require("lodash");
const emailTemplatePath = path.join(__dirname, "../views/emailTemplates");
const toEmail = env.GMAIL_USERNAME || "support@globaltongue.com";
const signature = "Global Tongue Team";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: false,
  auth: {
    user: env.GMAIL_USERNAME,
    pass: env.GMAIL_PASSWORD,
  },
});

module.exports.sendMail = async function (data) {
  const mailOptions = {
    to: data.to ? data.to : env.GMAIL_USERNAME,
    from: data.from,
    subject: data.subject,
    html: data.html,
  };
  return transporter.sendMail(mailOptions);
};

module.exports.contact_to_admin = async (emailData) => {
  emailData.subject = "Contact Us";
  return new Promise((resolve, reject) => {
    sendMail("contact", emailData, (err, resp) => {
      if (err) return reject(err);
      resolve(resp);
    });
  });
};

module.exports.sendAllMail = async function (data, to, html, subject, from) {
  const folderPath = path.join(__dirname, "..", "public");
  const content = await readFile(`${folderPath}/templates/${html}`, "utf8");
  const htmlToSend = ejs.render(content, { data });

  const mailOptions = {
    from: from,
    to: process.env.NODE_ENV === 'development' ? 'priyanshub850@gmail.com' : to,
    subject: subject,
    html: htmlToSend,
  };
  return transporter.sendMail(mailOptions);
};

sendMail = (templateName, emailData, cb) => {
  const defaultParams = {
    signature: signature,
  };
  const allParams = _.merge({}, defaultParams, emailData);
  const filePathContent = emailTemplatePath + "/" + templateName + ".ejs";
  const compiled = ejs.compile(fs.readFileSync(filePathContent, "utf8"));
  const attach = [];
  if (allParams.attachfile != undefined) {
    attach.push({
      filename: allParams.attachfile,
      path: config.global_url + "uploads/" + allParams.attachfile,
    });
  }
  const htmlContent = compiled(allParams);
  const mailOptions = {
    to: toEmail,
    from: allParams.from,
    subject: allParams.subject,
    html: htmlContent,
    attachments: attach,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return cb("Email sending failed", false);
    }
    return cb("Email sent successfully", true);
  });
};
