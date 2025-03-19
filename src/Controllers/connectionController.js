import {
  sendConnectionRequest,
  interractRequest,
  deleteRequest,
} from "../Reposetories/connectionRepo.js";
export const sendConnectionReq = async (req, res) => {
  //sending connection requests
  //will receive data of sender, receiver, time
  //will register a friend request into database which will only be deleted if its been interacted with or deleted by sender
  const request = req.body;
  try {
    const Req = await sendConnectionRequest(request);
    if (Req.success) {
      res.status(200).json(Req);
    } else {
      res.status(400).json(Req);
    }
  } catch (e) {
    console.log(e);

    res.status(400).json({ success: false, message: e.message });
  }
};

export const interactToReq = async (req, res) => {
  const { request, responce } = req.body;
  const user = req.user;
  try {
    const result = await interractRequest(request, responce, user);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteConnectionReq = async (req, res) => {
  const { request } = req.body;
  const user = req.user;
  try {
    const result = await deleteRequest(request, user);
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(400).json({ success: false, message: e.message });
  }
};
