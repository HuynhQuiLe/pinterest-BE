const jwt = require("jsonwebtoken");
const responseData = require("./responseData");

const tokenMajors = {
  createToken: (data) => {
    const token = jwt.sign({ data }, process.env.TOKEN_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "5m",
    });

    return token;
  },
  createRefToken: (data) => {
    const token = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "7d",
    });
    return token;
  },
  decodeToken: (token) => {
    return jwt.decode(token);
  },

  checkToken: (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY, (error, decode) => {
      return error;
    });
  },
  checkRefToken: (token) => {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (error, decode) => {
        return error;
      }
    );
  },

  verifyToken: (req, res, next) => {
    const { token } = req.headers;
    const checkedToken = tokenMajors.checkToken(token);
    if (!checkedToken) {
      next();
    } else {
      responseData(
        res,
        "Unauthorized - Bạn Không có quyền truy cập",
        checkedToken.name,
        401
      );
    }
  },
};

module.exports = tokenMajors;
