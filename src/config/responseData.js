const responseData = (res, message, data, statusCode) => {
  return res.status(statusCode).json({
    message,
    content: data,
    date: new Date(),
  });
};

module.exports = responseData;
