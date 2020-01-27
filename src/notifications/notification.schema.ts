import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['MESSAGE', 'FRIEND_REQUEST', 'GROUP_INVITATION'],
    required: true,
  },
  message: String,
  reference: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});
