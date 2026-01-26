var nodemailer = require("nodemailer");
const { DbService } = require("../services");
const { UserModel } = require("../models");
const { env } = require("../constants");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const _ = require("lodash");
const emailTemplatePath = path.join(__dirname, "../views/emailTemplates");
const toEmail = "info@swoofi.com";
const signature = "Swoofi Team";
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

module.exports.sendMail = function (data) {
  const mailOptions = {
    to: data.to ? data.to : env.GMAIL_USERNAME,
    from: data.from,
    subject: data.subject,
    html: data.html,
  };

  return new Promise(async (resolve, reject) => {
    try {
      const info = await transporter.sendMail(mailOptions);
      resolve(info);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports.contact_to_admin = (emailData) => {
  return new Promise((resolve, reject) => {
    try {
      emailData.subject = "Contact Us";
      sendMail("contact", emailData, (err, resp) => {
        resolve(resp);
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports.sendAllMail = async function (data, to, html, subject, from) {
  let folderPath = path.join(__dirname, "..", "public");
  const content = await readFile(`${folderPath}/templates/${html}`, "utf8");
  const htmlToSend = ejs.render(content, { data });

  const mailOptions = {
    from: from,
    to: process.env.NODE_ENV === 'development' ? 'pankaj.joshi@qpxtra.com' : to,
    subject: subject,
    html: htmlToSend,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const info = await transporter.sendMail(mailOptions);
      resolve(info)
    } catch (error) {
      reject(error)
      console.log(error, "this is mail error")
    }
  })
};
sendMail = (templateName, emailData, cb) => {
  const defaultParams = {
    signature: signature,

  };
  let allParams = _.merge({}, defaultParams, emailData);
  const filePathContent = emailTemplatePath + "/" + templateName + ".ejs";
  const compiled = ejs.compile(fs.readFileSync(filePathContent, "utf8"));
  let attach = []; // create an empty array
  if (allParams.attachfile != undefined) {
    attach.push({
      filename: allParams.attachfile,
      path: config.global_url + "uploads/" + allParams.attachfile,
    });
  }
  const html = compiled(allParams);
  let mailOptions = {
    to: toEmail,
    from: allParams.from,
    subject: allParams.subject,
    html: html,
    attachments: attach,
  };
  //send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Email Error:", error); // Log the error
      return cb("Email sending failed", false); // Return an error message
    }

    // Log success and return it as a response
    console.log("Email Success");
    return cb("Email sent successfully", true);
  });
};
