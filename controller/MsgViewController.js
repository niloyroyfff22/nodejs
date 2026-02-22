const { getMessages, getRecentChats } = require('../model/ChatDB');
//Model
const { getUsers, createUser } = require('../model/db');

exports.chatview = async (req, res) => {
  const sessionUser = req.session.user;
  const chatWithId = Number(req.params.id);
  const users = await getUsers();
  
const  foundUser = users.find(u => u.id === Number(chatWithId));
if (!foundUser) {
      res.json("no user");
      return;
    }


  const messages = await getMessages(sessionUser.id, chatWithId);



  res.json(messages)
}

exports.rcmsg = (req, res) => {
  const myId = req.session.user.id;
  const list = getRecentChats(myId);
  res.json(list);
}