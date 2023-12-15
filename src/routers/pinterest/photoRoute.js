const express = require("express");
const photoControllers = require("../../controllers/pinterest/photoControllers");
const tokenMajors = require("../../config/jwt");
const upload = require("../../config/upload");

const photoRouter = express.Router();

photoRouter
  .route("/get-all-photos")
  .get(tokenMajors.verifyToken, photoControllers.getAllPhotos);

photoRouter
  .route("/add")
  .post(
    tokenMajors.verifyToken,
    upload.single("photo"),
    photoControllers.addPhotos
  );

photoRouter.route("/search/:key").get(photoControllers.searchPhotoByName);

photoRouter
  .route("/detail/by-photo/:photo_id")
  .get(photoControllers.getDetailByPhotoID);

photoRouter
  .route("/comment/by-photo/:photo_id")
  .get(photoControllers.getCommentByPhotoID);

photoRouter
  .route("/detail/save/:photo_id")
  .post(tokenMajors.verifyToken, photoControllers.createSave);

photoRouter
  .route("/comment/add/:photo_id")
  .post(tokenMajors.verifyToken, photoControllers.addCommentPhoto);

photoRouter
  .route("/detail/saved/get-list-by-user")
  .get(tokenMajors.verifyToken, photoControllers.getSavedPhotoByUser);

photoRouter
  .route("/detail/created/get-list-by-user")
  .get(tokenMajors.verifyToken, photoControllers.getCreatedPhotoByUser);

photoRouter
  .route("/delete/:photo_id")
  .delete(tokenMajors.verifyToken, photoControllers.deletePhotoByPhotoID);

photoRouter
  .route("/detail/save/:photo_id")
  .get(tokenMajors.verifyToken, photoControllers.getSave);

module.exports = photoRouter;
