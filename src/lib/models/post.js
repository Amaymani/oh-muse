import mongoose, { Schema, Types } from "mongoose";

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
    }
},
    {
        timestamps: true,
    }
);

const Post = mongoose.models?.Post || mongoose.model("Post", postSchema);
export default Post;