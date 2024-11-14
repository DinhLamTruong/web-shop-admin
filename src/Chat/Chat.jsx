import React, { useEffect, useState } from 'react';
// import UserAPI from '../API/UserAPI';
import ChatRoomsAPI from '../API/ChatRoomsAPI';
import './Chat.css';

import io from 'socket.io-client';
const socket = io('https://asm-njs03-server.onrender.com', {
  transports: ['websocket'],
});

function Chat(props) {
  const [page, setPage] = useState(1);
  const [allRoom, setAllRoom] = useState([]);
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState([]);
  const [load, setLoad] = useState(false);
  const [textMessage, setTextMessage] = useState('');

  const idUser = localStorage.getItem('id_user');

  const onChangeText = e => {
    setTextMessage(e.target.value);
  };

  // Hàm này dùng để tìm ra những user khác với admin
  useEffect(() => {
    const fetchData = async () => {
      const result = await ChatRoomsAPI.getAllRoom();

      setAllRoom(result);
    };
    fetchData();
  }, [idUser]);

  // Hàm này dùng để load dữ liệu message và nó sẽ chạy lại khi state id_user2 thay đổi
  // Tức là khi admin chọn người dùng mà admin muốn chat thì state id_user2 sẽ thay đổi
  // để gọi lại hàm này
  useEffect(() => {
    if (roomId) {
      const fetchData = async () => {
        const result = await ChatRoomsAPI.getMessageByRoomId(roomId);
        setMessage(result);
      };
      fetchData();
      setTimeout(() => {
        socket.emit('send_message', { roomId });
        setLoad(true);
      }, 200);
    }
  }, [roomId]);

  const handleScroll = e => {
    if (e.target.scrollTop === 0) {
      setPage(prevPage => prevPage + 1); // Tăng trang để tải thêm tin nhắn cũ
      setLoad(true);
    }
  };

  // Đây là hàm lấy dữ liệu từ api dựa vào state load
  // Dùng để load lại tin nhắn khi có socket từ server gửi tới
  useEffect(() => {
    if (load) {
      const fetchData = async () => {
        const response = await ChatRoomsAPI.getMessageByRoomId(roomId, page);

        if (page >= 2) {
          return setMessage(prev => [...response, ...prev]);
        }
        setMessage(response);
      };
      fetchData();

      setLoad(false);
    }
  }, [load, roomId, page]);

  // Hàm này dùng để nhận socket từ server gửi lên
  useEffect(() => {
    // Nhận dữ liệu từ server gửi lên thông qua socket với key receive_message
    socket.on('receive_message', data => {
      //Sau đó nó sẽ setLoad gọi lại hàm useEffect lấy lại dữ liệu
      setLoad(true);
    });
  }, []);

  // Hàm này dùng để gửi tin nhắn cho khách hàng
  const handlerSend = async () => {
    if (!roomId) {
      return;
    }
    if (!textMessage) return;

    const data = {
      sender: idUser,
      message: textMessage,
      roomId: roomId,
      is_admin: true,
    };

    await ChatRoomsAPI.addMessage(data);
    setTextMessage('');
    setPage(1);

    setTimeout(() => {
      socket.emit('send_message', data);
      setLoad(true);
    }, 200);
  };

  const handleRoomChange = roomId => {
    setRoomId(roomId);
    setPage(1);
  };

  return (
    <div className="page-wrapper" style={{ display: 'block' }}>
      <div className="page-breadcrumb">
        <div className="row">
          <div className="col-7 align-self-center">
            <h4 className="page-title text-truncate text-dark font-weight-medium mb-1">
              Chat
            </h4>
            <div className="d-flex align-items-center">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 p-0">
                  <li
                    className="breadcrumb-item text-muted active"
                    aria-current="page"
                  >
                    Apps
                  </li>
                  <li
                    className="breadcrumb-item text-muted"
                    aria-current="page"
                  >
                    Chat
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="row no-gutters">
                <div className="col-lg-3 col-xl-2 border-right">
                  <div className="card-body border-bottom">
                    <form>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Search Contact"
                      />
                    </form>
                  </div>
                  <div
                    className="scrollable position-relative"
                    style={{ height: 'calc(80vh - 111px)' }}
                  >
                    <ul className="mailbox list-style-none">
                      <li>
                        <div className="message-center">
                          {allRoom &&
                            allRoom.map(value => (
                              <a
                                href="#/"
                                key={value._id}
                                onClick={() => handleRoomChange(value._id)}
                                className="message-item d-flex align-items-center border-bottom px-3 py-2 active_user"
                              >
                                <div className="user-img">
                                  {' '}
                                  <img
                                    src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                    alt="user"
                                    className="img-fluid rounded-circle"
                                    width="40px"
                                  />{' '}
                                  <span className="profile-status away float-right"></span>
                                </div>
                                <div className="w-75 d-inline-block v-middle pl-2">
                                  <h6 className="message-title mb-0 mt-1">
                                    {value._id}
                                  </h6>
                                </div>
                              </a>
                            ))}
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-9  col-xl-10">
                  <div
                    onScroll={handleScroll}
                    className="chat-box scrollable position-relative"
                    style={{ height: 'calc(80vh - 111px)' }}
                  >
                    <ul
                      className="chat-list list-style-none px-3 pt-3"
                      style={{ display: 'block' }}
                    >
                      {message &&
                        message.map((value, i) =>
                          value.sender === idUser ? (
                            <li
                              className="chat-item odd list-style-none mt-3"
                              key={i}
                            >
                              <div className="chat-content text-right d-inline-block pl-3">
                                <div className="box msg p-2 d-inline-block mb-1">
                                  You: {value.message}
                                </div>
                                <br />
                              </div>
                            </li>
                          ) : (
                            <li
                              className="chat-item list-style-none mt-3"
                              key={i}
                            >
                              <div className="chat-img d-inline-block">
                                <img
                                  src="https://img.icons8.com/color/36/000000/administrator-male.png"
                                  alt="user"
                                  className="rounded-circle"
                                  width="45"
                                />
                              </div>
                              <div className="chat-content d-inline-block pl-3">
                                <h6 className="font-weight-medium">
                                  {value.name}
                                </h6>
                                <div className="msg p-2 d-inline-block mb-1">
                                  Client: {value.message}
                                </div>
                              </div>
                              <div className="chat-time d-block font-10 mt-1 mr-0 mb-3"></div>
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                  <div className="card-body border-top">
                    <div className="row">
                      <div className="col-9">
                        <div className="input-field mt-0 mb-0">
                          <input
                            id="textarea1"
                            placeholder="Type and enter"
                            className="form-control border-0"
                            type="text"
                            onChange={onChangeText}
                            value={textMessage}
                          />
                        </div>
                      </div>
                      <div className="col-3">
                        <a
                          href="#/"
                          className="btn-circle btn-lg btn-cyan float-right text-white"
                          onClick={handlerSend}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer text-center"></footer>
    </div>
  );
}

export default Chat;
