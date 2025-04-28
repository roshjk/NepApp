import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain at least 3 characters."],
    maxLength: [30, "Name cannot contain more than 30 characters."],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide valid email."],
  },
  phone: {
    type: Number,
    required: function () {
      return this.role !== "Admin";
    },
  },
  address: {
    type: String,
    required: function () {
      return this.role !== "Admin";
    },
  },
  niches: {
    firstNiche: String,
    secondNiche: String,
    thirdNiche: String,
  },
  bio: {
    type: String,
    maxLength: [300, "Bio cannot be longer than 300 characters."],
  },
  skills: [
    {
      type: String,
    },
  ],
  education: [
    {
      degree: String,
      institution: String,
      year: String,
    },
  ],
  experience: [
    {
      title: String,
      company: String,
      year: String,
    },
  ],
  portfolio: [
    {
      title: String,
      link: String,
    },
  ],
  resume: {
    public_id: String,
    url: String,
  },
  coverLetter: {
    type: String,
  },
  profilePic: {
    public_id: String,
    url: String,
  },
  password: {
    type: String,
    required: true,
    minLength: [7, "Password must contain at least 7 characters."],
    maxLength: [30, "Password cannot contain more than 30 characters."],
  },
  role: {
    type: String,
    required: true,
    enum: ["Student", "Business", "Admin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Password Hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Password Compare
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
