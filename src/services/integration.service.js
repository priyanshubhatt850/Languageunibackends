const AWS = require("aws-sdk");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

class IntegrationService {
  // async uploadFile(file) {
  //   if (!file) throw new Error("No file provided");

  //   const ext = path.extname(file.originalname);
  //   const key = `uploads/${uuidv4()}${ext}`;

  //   const params = {
  //     Bucket: process.env.AWS_S3_BUCKET,
  //     Key: key,
  //     Body: file.buffer,
  //     ContentType: file.mimetype,
  //     ACL: "public-read",
  //   };

  //   const result = await s3.upload(params).promise();
  //   return result.Location;
  // }
  async uploadFile(file) {
    if (!file) throw new Error("No file provided");

    // Convert buffer → Base64
    const base64 = file.buffer.toString("base64");

    // Include mime type (important for frontend rendering)
    const base64Image = `data:${file.mimetype};base64,${base64}`;

    return base64Image;
  }

}

module.exports = new IntegrationService();
