const responseData = require("../config/responseData");

const initModels = require("../models/init-models");
const sequelize = require("../models/connect");
const bcrypt = require("bcrypt");
const tokenMajors = require("../config/jwt");
const { where } = require("sequelize");

const model = initModels(sequelize);

const authControllers = {
  login: async (req, res) => {
    try {
      const { email, pass_word } = req.body;

      const user = await model.users.findOne({ where: { email } });
      if (!user) {
        return responseData(res, "Email không tồn tại.", null, 404);
      }

      if (bcrypt.compareSync(pass_word.toString(), user.pass_word)) {
        let key = new Date().getTime();

        const token = tokenMajors.createToken({
          user_id: user.user_id,
          role: user.role,
          key,
        });

        // tao refresh token va update
        const refToken = tokenMajors.createRefToken({
          user_id: user.user_id,
          role: user.role,
          key,
        });

        await model.users.update(
          { ...user.dataValues, refresh_token: refToken },
          { where: { user_id: user.user_id } }
        );

        responseData(res, "Đăng nhập thành công.", token, 200);
      } else {
        responseData(res, "Mật khẩu không đúng.", null, 400);
      }
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra - không thể đăng nhập.", null, 400);
    }
  },

  register: async (req, res) => {
    try {
      const { email, full_name, pass_word, birthday } = req.body;
      //kiem tra trung email
      const duplicate = await model.users.findOne({ where: { email } });
      if (duplicate) {
        return responseData(res, "Email đã tồn tại.", null, 409);
      }

      const user = {
        email,
        full_name,
        pass_word: bcrypt.hashSync(pass_word.toString(), 10),
        phone: null,
        avatar: "",
        birthday,
        gender: 1,
        join_date: new Date(),
        role: "USER",
        refresh_token: null,
        user_status: "ACTIVE",
      };

      await model.users.create(user);

      responseData(res, "Đăng ký tài khoản thành công.", null, 201);
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra - không thể đăng ký.", null, 400);
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { token } = req.headers;
      //check token
      const checkedToken = tokenMajors.checkToken(token);
      if (checkedToken && checkedToken.name !== "TokenExpiredError") {
        return responseData(
          res,
          "Not Authorized! - Token không hợp lệ",
          checkedToken.name,
          401
        );
      }

      // lay ta refresh token
      const { user_id, key } = tokenMajors.decodeToken(token).data;
      const user = await model.users.findOne({ where: { user_id } });
      const { refresh_token } = user;

      // check refresh token
      const checkedRefToken = tokenMajors.checkRefToken(refresh_token);

      if (checkedRefToken && checkedRefToken.name !== "TokenExpiredError") {
        return responseData(
          res,
          "Not Authorized! - Refresh Token không hợp lệ",
          checkedToken.name,
          401
        );
      }

      // refresh token out of date => login again
      if (checkedRefToken && checkedRefToken.name === "TokenExpiredError") {
        return responseData(res, "LOGIN_AGAIN", checkedToken.name, 401);
      }

      const { key: refKey } = tokenMajors.decodeToken(refresh_token).data;

      if (key !== refKey) {
        return responseData(
          res,
          "Not Authorized! - Có thể tài khoản của bạn đang bị đăng nhập nơi khác",
          checkedToken.name,
          409
        );
      }

      //create new token

      const newToken = tokenMajors.createToken({ user_id, key: refKey });
      responseData(res, "Tạo mới token thành công", newToken, 201);
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra với refesh token", null, 400);
    }
  },

  logout: async (req, res) => {
    try {
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      const user = await model.users.findOne({ where: { user_id } });

      await model.users.update(
        { ...user.dataValues, refresh_token: "" },
        { where: { user_id } }
      );

      responseData(res, "Đăng xuất thành công.", null, 200);
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra khi đăng xuất.", null, 400);
    }
  },

  // refreshToken: async (req, res) => {
  //   try {
  //     const { token } = req.headers;

  //     // check coi dung token khong
  //     let checkedToken = tokenMajors.checkToken(token);
  //     // khong dung
  //     if (checkedToken && checkedToken.name !== "TokenExpiredError") {
  //       return responseData(res, "Not Authorized!", checkedToken.name, 401);
  //     }
  //     // dung
  //     const dToken = tokenMajors.decodeToken(token);
  //     const user = await model.users.findOne({
  //       where: {
  //         user_id: dToken.data.user_id,
  //       },
  //     });

  //     const { refresh_token } = user;
  //     // check refresh token
  //     let checkRefToken = tokenMajors.checkRefToken(refresh_token);
  //     if (checkRefToken) {
  //       return responseData(res, "Not Authorized!", checkRefToken.name, 401);
  //     }

  //     // check key co hop le khong
  //     const dRefToken = tokenMajors.decodeToken(refresh_token);

  //     if (dToken.data.key !== dRefToken.data.key) {
  //       return responseData(res, "Not Authorized!", checkRefToken.name, 401);
  //     }

  //     // tao moi token
  //     let newToken = tokenMajors.createToken({
  //       user_id: user.user_id,
  //       key: dRefToken.data.key,
  //     });
  //     responseData(
  //       res,
  //       "Tạo mới token thông qua refresh token thành công.",
  //       newToken,
  //       201
  //     );
  //   } catch (error) {
  //     responseData(res, "Đã có lỗi xảy ra với refresh token.", null, 500);
  //   }
  // },
};

module.exports = authControllers;
