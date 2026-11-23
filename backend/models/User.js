
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const taskSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    detail: String,
    done: { type: Boolean, default: false },
  },
  { _id: false }
);

const dashboardSchema = new mongoose.Schema(
  {
    tasks: {
      type: [taskSchema],
      default: () => [
        {
          id: 1,
          title: "Complete your student profile",
          detail: "Add your academic background and interests",
          done: false,
        },
        {
          id: 2,
          title: "Explore your university options",
          detail: "Shortlist universities that match your goals",
          done: false,
        },
        {
          id: 3,
          title: "Explore career paths",
          detail: "Discover careers that interest you",
          done: false,
        },
        {
          id: 4,
          title: "Start a learning roadmap",
          detail: "Build skills for your chosen career",
          done: false,
        },
      ],
    },
    universities: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    careerInterests: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    development: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    community: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    university: { type: String, default: "" },
    degree: { type: String, default: "" },
    year: { type: String, default: "" },
    interests: { type: [String], default: [] },
    skills: { type: [String], default: [] },

    // Each user gets an independent dashboard.
    dashboard: {
      type: dashboardSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
