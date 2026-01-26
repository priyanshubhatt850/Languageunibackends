const express = require("express");
const router = express.Router();
const multer = require("multer");

const integrationController = require("../controllers/integrationController");
const { authMiddleware } = require("../middleware");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

router.post(
  "/upload-file",
  upload.single("file"),
  integrationController.uploadFile
);

module.exports = router;
