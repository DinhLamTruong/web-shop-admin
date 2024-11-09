import axiosClient from './axiosClient';

const HistoryAPI = {
  getHistoryData: () => {
    const url = `/api/histories/data`;
    return axiosClient.get(url);
  },

  getDetail: id => {
    const url = `/api/histories/${id}`;
    return axiosClient.get(url);
  },

  getAll: () => {
    const url = '/api/histories/all';
    return axiosClient.get(url);
  },
};

export default HistoryAPI;
