import mongoose, { Schema, Types } from "mongoose";
import Community from "./community";
import User from "./user";

const postSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    user: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    images3key: {
        type: String,
        required: false
    },
    communityid: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a 'User' model
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User', // Assuming you have a 'User' model
            required: true
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
},
    {
        timestamps: true,
    }
);

const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);
export default Post;