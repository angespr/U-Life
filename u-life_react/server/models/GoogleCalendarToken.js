const mongoose = require("mongoose");

const GoogleCalendarTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    expiryDate: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GoogleCalendarToken", GoogleCalendarTokenSchema);