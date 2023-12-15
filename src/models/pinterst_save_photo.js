const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return pinterst_save_photo.init(sequelize, DataTypes);
}

class pinterst_save_photo extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    save_photo_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    save_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    photo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pinterst_photos',
        key: 'photo_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'pinterst_save_photo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "save_photo_id" },
        ]
      },
      {
        name: "photo_id",
        using: "BTREE",
        fields: [
          { name: "photo_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
