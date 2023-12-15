const tokenMajors = require("../../config/jwt");
const responseData = require("../../config/responseData");
const fs = require("fs");

const initModels = require("../../models/init-models");
const sequelize = require("../../models/connect");
const model = initModels(sequelize);

const { Sequelize, where } = require("sequelize");
let Op = Sequelize.Op;

const photoControllers = {
  getAllPhotos: async (req, res) => {
    try {
      const photos = await model.pinterst_photos.findAll({
        order: [["date_created", "DESC"]],
      });
      responseData(res, "Lấy danh sách hình ảnh thành công ", photos, 200);
    } catch (error) {
      responseData(res, "Lấy danh sách hình ảnh thất bại", null, 400);
    }
  },
  addPhotos: async (req, res) => {
    const { token } = req.headers;
    const { user_id } = tokenMajors.decodeToken(token).data;
    const { photo_name, description } = req.body;
    // them hinh anh
    let { file } = req;

    const photo = {
      user_id,
      photo_name,
      description,
      photo_url: file.filename,
      date_created: new Date(),
    };

    const data = await model.pinterst_photos.create(photo);
    responseData(res, "Thêm ảnh thành công", data, 201);
  },
  searchPhotoByName: async (req, res) => {
    try {
      const { key } = req.params;
      const photos = await model.pinterst_photos.findAll({
        where: {
          photo_name: {
            [Op.like]: `%${key}%`,
          },
        },
      });
      responseData(res, "Tìm kiếm hình ảnh theo tên thành công ", photos, 200);
    } catch (error) {
      responseData(res, "Tìm kiếm hình ảnh theo tên thất bại", null, 400);
    }
  },
  getDetailByPhotoID: async (req, res) => {
    try {
      const { photo_id } = req.params;
      const detail = await model.pinterst_photos.findOne({
        where: { photo_id },
        include: ["user"],
      });

      responseData(
        res,
        "Lấy thông tin hình ảnh và người dùng bằng ID ảnh thành công",
        detail,
        200
      );
    } catch (error) {
      responseData(
        res,
        "Lấy thông tin hình ảnh và người dùng bằng ID ảnh thất bại",
        null,
        400
      );
    }
  },
  getCommentByPhotoID: async (req, res) => {
    try {
      const { photo_id } = req.params;
      const comment = await model.pinterst_comments.findAll({
        where: { photo_id },
        include: ["user", "photo"],
        order: [["comment_date", "DESC"]],
      });

      responseData(
        res,
        "Lấy thông tin bình luận bằng ID ảnh thành công",
        comment,
        200
      );
    } catch (error) {
      responseData(
        res,
        "Lấy thông tin bình luận bằng ID ảnh thất bại",
        null,
        400
      );
    }
  },
  createSave: async (req, res) => {
    try {
      const { photo_id } = req.params;
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      const savedPhoto = await model.pinterst_save_photo.findOne({
        where: {
          photo_id,
          user_id,
        },
      });

      if (savedPhoto) {
        await model.pinterst_save_photo.destroy({
          where: {
            photo_id,
            user_id,
          },
        });
        return responseData(res, "Đã unsave hình thành công", false, 201);
      }

      const save = { photo_id, user_id, save_date: new Date() };
      await model.pinterst_save_photo.create(save);

      responseData(res, "Đã save hình thành công", true, 201);
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra - tính năng save hình", null, 400);
    }
  },
  getSave: async (req, res) => {
    try {
      const { photo_id } = req.params;
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      const savedPhoto = await model.pinterst_save_photo.findOne({
        where: {
          photo_id,
          user_id,
        },
      });

      if (savedPhoto) {
        responseData(res, "Bạn đã save hình này", true, 200);
      } else {
        responseData(res, "Bạn chưa save hình này", false, 200);
      }
    } catch (error) {
      responseData(
        res,
        "Lấy thông tin đã lưu hình hay chưa thất bại",
        null,
        400
      );
    }
  },
  addCommentPhoto: async (req, res) => {
    try {
      const { photo_id } = req.params;
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      const { content } = req.body;

      const comment = {
        user_id,
        photo_id,
        content,
        comment_date: new Date(),
      };

      await model.pinterst_comments.create(comment);

      responseData(
        res,
        "Thêm mới bình luận cho hình ảnh thành công",
        null,
        201
      );
    } catch (error) {
      responseData(res, "Thêm mới bình luận cho hình ảnh thất bại", null, 400);
    }
  },

  getSavedPhotoByUser: async (req, res) => {
    try {
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      const savedPhotos = await model.pinterst_save_photo.findAll({
        where: { user_id },
        include: ["user", "photo"],
      });

      responseData(
        res,
        "Lấy danh sách ảnh đã lưu theo người dùng thành công",
        savedPhotos,
        200
      );
    } catch (error) {
      responseData(
        res,
        "Lấy danh sách ảnh đã lưu theo người dùng thất bại",
        null,
        400
      );
    }
  },

  getCreatedPhotoByUser: async (req, res) => {
    try {
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      const createdPhotos = await model.pinterst_photos.findAll({
        where: { user_id },
        include: ["user"],
      });

      responseData(
        res,
        "Lấy danh sách ảnh đã tạo theo người dùng thành công",
        createdPhotos,
        200
      );
    } catch (error) {
      responseData(
        res,
        "Lấy danh sách ảnh đã tạo theo người dùng thất bại",
        null,
        400
      );
    }
  },

  deletePhotoByPhotoID: async (req, res) => {
    try {
      const { photo_id } = req.params;
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      const photo = await model.pinterst_photos.findOne({
        where: { photo_id },
      });

      if (!photo) {
        return responseData(res, "Không tìm thấy hình ảnh.", null, 404);
      }

      if (photo.user_id === user_id) {
        await model.pinterst_photos.destroy({
          where: { photo_id },
        });
        responseData(res, "Bạn đã xoá ảnh thành công.", null, 200);
      } else {
        responseData(
          res,
          "Bạn không được xoá ảnh của người dùng khác.",
          null,
          409
        );
      }
    } catch (error) {
      responseData(res, "Không thể xoá ảnh đã được bình luận", null, 400);
    }
  },
};

module.exports = photoControllers;
