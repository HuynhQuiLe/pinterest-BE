const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return pinterst_comments.init(sequelize, DataTypes);
}

class pinterst_comments extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    comment_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    comment_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    photo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'pinterst_photos',
        key: 'photo_id'
      }
    }
  }, {
    sequelize,
    tableName: 'pinterst_comments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "comment_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "photo_id",
        using: "BTREE",
        fields: [
          { name: "photo_id" },
        ]
      },
    ]
  });
  }
}
