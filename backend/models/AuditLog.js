
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    resourceId: {
      type: String,
      default: "",
    },
    resourceOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    outcome: {
      type: String,
      enum: ["success", "denied"],
      required: true,
    },
    details: {
      type: String,
      default: "",
      maxlength: 500,
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditLogSchema);
