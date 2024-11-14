import axiosClient from './axiosClient';

const ChatRoomsAPI = {
  getMessageByRoomId: (roomId, page) => {
    const url = `/api/chatrooms/roomid?roomId=${roomId}&page=${page}`;
    return axiosClient.get(url);
  },

  createNewRoom: userId => {
    const url = `/api/chatrooms/create-room`;
    return axiosClient.post(url, userId);
  },

  addMessage: body => {
    const url = `/api/chatrooms/add-message`;
    return axiosClient.put(url, body);
  },

  getAllRoom: idUser => {
    const url = `/api/chatrooms/all-room?id=${idUser}`;
    return axiosClient.get(url);
  },
};

export default ChatRoomsAPI;
