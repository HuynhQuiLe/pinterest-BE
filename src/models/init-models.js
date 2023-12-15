const DataTypes = require("sequelize").DataTypes;
const _pinterst_comments = require("./pinterst_comments");
const _pinterst_photos = require("./pinterst_photos");
const _pinterst_save_photo = require("./pinterst_save_photo");
const _users = require("./users");

function initModels(sequelize) {
  const pinterst_comments = _pinterst_comments(sequelize, DataTypes);
  const pinterst_photos = _pinterst_photos(sequelize, DataTypes);
  const pinterst_save_photo = _pinterst_save_photo(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  pinterst_comments.belongsTo(pinterst_photos, { as: "photo", foreignKey: "photo_id"});
  pinterst_photos.hasMany(pinterst_comments, { as: "pinterst_comments", foreignKey: "photo_id"});
  pinterst_save_photo.belongsTo(pinterst_photos, { as: "photo", foreignKey: "photo_id"});
  pinterst_photos.hasMany(pinterst_save_photo, { as: "pinterst_save_photos", foreignKey: "photo_id"});
  pinterst_comments.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(pinterst_comments, { as: "pinterst_comments", foreignKey: "user_id"});
  pinterst_photos.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(pinterst_photos, { as: "pinterst_photos", foreignKey: "user_id"});
  pinterst_save_photo.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(pinterst_save_photo, { as: "pinterst_save_photos", foreignKey: "user_id"});

  return {
    pinterst_comments,
    pinterst_photos,
    pinterst_save_photo,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
