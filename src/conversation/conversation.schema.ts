import * as mongoose from 'mongoose';

export const ConversationSchema = new mongoose.Schema({

  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  messages: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      message: String,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});
