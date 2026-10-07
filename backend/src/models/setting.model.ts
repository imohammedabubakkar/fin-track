import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, index: true },
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

settingSchema.index({ ownerId: 1, key: 1 }, { unique: true });

export const Setting = mongoose.model("Setting", settingSchema, "settings");
