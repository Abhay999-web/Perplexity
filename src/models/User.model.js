import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    profile: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String,
    },
    apiKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) 
    return;
    this.password = await bcrypt.hash(this.password, 10);
  
 
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


const userModel = mongoose.model("User", userSchema);

export default userModel;
 