import mongoose, { Schema, Types } from "mongoose";

const userSchema = new Schema(
  {
    _id: {
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
    bio: {
      type: String,
      trim: true,
    },
    profileImgKey: {
      type: String,
      trim: true,
    },
    following:{
      type:[String]
    },
    followers:{
      type:[String]
    },
    communities:{
      type:[Schema.Types.ObjectId],
      ref: "Community"
    }
    
  },
  {
    timestamps: true,
  }
);

userSchema.index({ username: 1 },{ name: 'username_index' });

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;
