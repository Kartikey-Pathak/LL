import mongoose,{Schema} from "mongoose";


const MessageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     title: {
      type: String, // chat title
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const UserSchema=new Schema({
    username:{
        type:String,
        required:[true,"UserName is required"],
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true
    },
    VerifyCode:{
        type:String,
    
    },
    VerifyCodeExpiry:{
         type:Date,
          
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    VerifyToken:{
      type:String,
    },
    VerifyTokenExpiry:{
      type:Date,
    },
    Messages:[MessageSchema]
    

},{ timestamps: true })

// TTL index to auto-delete after 10 minutes
UserSchema.index({ VerifyCodeExpiry: 1 }, { expireAfterSeconds: 0 });

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);

export {User,Message};