import { trim, uniq } from "lodash";
import mongoose, { Schema, Types } from "mongoose";

const communitySchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    communityName: {
        type: String,
        required: true,
        unique: true,
    },
    members: {
        type: [Schema.Types.ObjectId]
    },
    communityImg: {
        type: String,
        trim: true,
    },
    modName:{
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: "User",
    },
    desc:{
        type: String,
        required: true,
        trim: true,
    },
    membersCount: {
        type: Number,
        default: 0 
    }
},
    {
        timestamps: true,
    }
);

communitySchema.index({ communityName: 1 },{ name: 'communityName_index' });


communitySchema.index({ membersCount: -1 },{ name: 'membersCount_index' }); 
communitySchema.pre('save', function(next) {
    this.membersCount = this.members.length;
    next();
});

const Community = mongoose.models?.Community || mongoose.model("Community", communitySchema);
export default Community;