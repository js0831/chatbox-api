import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  accountId: {
      type: String,
      unique : true,
  },
  firstname: String,
  lastname: String,
  email: String,
  username: String,
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  invitations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  confirmations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});
