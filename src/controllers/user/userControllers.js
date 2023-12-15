const tokenMajors = require("../../config/jwt");

const initModels = require("../../models/init-models");
const sequelize = require("../../models/connect");
const responseData = require("../../config/responseData");
const model = initModels(sequelize);

const userControllers = {
  getUser: async (req, res) => {
    try {
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;
      const user = await model.users.findOne({ where: { user_id } });
      responseData(res, "Lấy thông tin người dùng thành công", user, 200);
    } catch (error) {
      responseData(res, "Không thể lấy thông tin người dùng", null, 400);
    }
  },

  editUser: async (req, res) => {
    try {
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;
      const { birthday, full_name, gender, phone } = req.body;
      // them hinh anh
      let { file } = req;

      const user = await model.users.findOne({ where: { user_id } });

      user.birthday = birthday;
      user.full_name = full_name;
      user.gender = gender;
      user.phone = phone;
      if (file?.filename) {
        user.avatar = file.filename;
      }

      await model.users.update(user.dataValues, { where: { user_id } });
      responseData(res, "Cập nhật thông tin người dùng thành công", user, 200);
    } catch (error) {
      responseData(res, "Không thể cập nhật thông tin người dùng", null, 400);
    }
  },
};

module.exports = userControllers;
