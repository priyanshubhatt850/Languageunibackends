const { UserModel } = require("../models");
const { DbService } = require("../services");
const progress = async (req, res, next) => {
  try {
    const mobileProgress = req.body.mobileProgress;
    if (mobileProgress) {
      await DbService.update(
        UserModel,
        { _id: req.user._id },
        { $set: { mobileProgress: mobileProgress } },
        { new: true }
      );
    } next();
  } catch (error) {
    next(error);
  }
};
module.exports = progress;
