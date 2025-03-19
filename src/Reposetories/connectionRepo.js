import User from "../Models/userSchema.js";
import Request from "../Models/requestSchema.js";
import mongoose from "mongoose";
export const sendConnectionRequest = async (request) => {
  const { sender, receiver } = request;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const senderUser = await User.findById(sender)
      .select("-password")
      .session(session);
    const receiverUser = await User.findById(receiver)
      .select("-password")
      .session(session);

    if (!senderUser || !receiverUser) {
      throw new Error("Sender or receiver not found");
    }

    const existingRequest = await Request.findOne({ sender, receiver }).session(
      session
    );

    if (existingRequest) {
      throw new Error("A request already exists between these users");
    }

    const newRequest = new Request({
      sender,
      senderName: senderUser.fullName,
      receiver,
      status: "pending",
    });

    await newRequest.save({ session });

    senderUser.requests.push(newRequest._id);
    receiverUser.requests.push(newRequest._id);

    await senderUser.save({ session });
    await receiverUser.save({ session });

    await session.commitTransaction();
    console.log("Transaction committed successfully.");
    return { success: true, message: "Request sent successfully" };
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction aborted due to an error:", error);
    return { success: false, message: error.message };
  } finally {
    session.endSession();
  }
};

export const interractRequest = async (request, responce, user) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const req = await Request.findById(request).session(session);

    if (req) {
      const sender = await User.findById(req.sender).session(session);
      const receiver = await User.findById(req.receiver).session(session);
      console.log(req.receiver);
      console.log(user._id);

      if (!user._id.equals(req.receiver)) {
        throw new Error("Sender cannot accept requests");
      }

      if (responce === true) {
        if (sender && receiver) {
          sender.connections.push(receiver);
          receiver.connections.push(sender);

          // Remove the request from both users' requests arrays
          sender.requests.pull(request);
          receiver.requests.pull(request);

          // Save the updated users
          await sender.save({ session });
          await receiver.save({ session });

          // Delete the request document
          await Request.findByIdAndDelete(request).session(session);

          await session.commitTransaction();
          console.log("Transaction committed successfully.");
          return {
            success: true,
            message: "Connection request accepted successfully",
          };
        } else {
          throw new Error("Sender or Receiver does not exist");
        }
      } else {
        sender.requests.pull(request);
        receiver.requests.pull(request);

        // Save the updated users
        await sender.save({ session });
        await receiver.save({ session });

        // Delete the request document
        await Request.findByIdAndDelete(request).session(session);
        await session.commitTransaction();
        console.log("Transaction committed successfully.");
        return { success: true, message: "Request Rejected" };
      }
    } else {
      throw new Error("Request Invalid");
    }
  } catch (e) {
    await session.abortTransaction();
    console.error("Transaction aborted due to an error:", e);
    return { success: false, message: e.message };
  } finally {
    session.endSession();
  }
};

export const deleteRequest = async (request, user) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const req = await Request.findById(request).session(session);
    if (req) {
      const sender = await User.findById(req.sender).session(session);
      const receiver = await User.findById(req.receiver).session(session);
      if (!user._id.equals(req.sender)) {
        throw new Error("Invalid user");
      }
      sender.requests.pull(request);
      receiver.requests.pull(request);

      // Save the updated users
      await sender.save({ session });
      await receiver.save({ session });

      // Delete the request document
      await Request.findByIdAndDelete(request).session(session);
      await session.commitTransaction();
      console.log("Transaction committed successfully.");
      return { success: true, message: "Request Deleted" };
    } else {
      throw new Error("Request Invalid");
    }
  } catch (e) {
    await session.abortTransaction();
    console.error("Transaction aborted due to an error:", error);
    return { success: false, message: error.message };
  } finally {
    session.endSession();
  }
};
