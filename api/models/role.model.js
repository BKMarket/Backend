const mongoose = require('mongoose');
const roleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    permissions: {
      type: [String],
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Role = mongoose.model('Role', roleSchema, 'roles');

module.exports = Role;
