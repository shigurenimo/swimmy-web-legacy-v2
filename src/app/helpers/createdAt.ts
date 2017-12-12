import * as moment from 'moment';

export const createdAt = (date) => {
  const diff = moment().diff(moment(date));
  const hours = Math.round(diff / (1000 * 60 * 60));
  if (hours < 1) {
    return Math.round(diff / (1000 * 60)) + '分前';
  }
  if (hours < 24) {
    return hours + '時間前';
  }
  return Math.round(diff / (1000 * 60 * 60 * 24)) + '日前';
};
