import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    _id:{
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);
 
export default User;