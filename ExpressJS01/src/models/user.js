const { DataTypes } = require(`sequelize`);
const { sequelize } = require(`../config/database`);

const User = sequelize.define(`User`, {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: `User`
    },
    resetOtp: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetOtpExpiration: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: `users`,
    timestamps: true
});

module.exports = User;