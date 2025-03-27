import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

messageSchema.virtual("createdAtIST").get(function () {
  return new Date(this.createdAt).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
});

messageSchema.virtual("updatedAtIST").get(function () {
  return new Date(this.updatedAt).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
