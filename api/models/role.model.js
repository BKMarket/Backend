const mongoose = require('#config/db/customMongoose.js');
const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    permissions: {
      type: [
        {
          type: String,
          enum: ['buy', 'sell', 'ban']
        }
      ],
      default: ['buy']
    }
  },
  {
    timestamps: true
  }
);

const Role = mongoose.model('Role', roleSchema, 'roles');

module.exports = Role;
