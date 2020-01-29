import * as mongoose from 'mongoose';

export const ConversationSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ['PERSONAL', 'GROUP'],
    default: 'PERSONAL',
    required: true,
  },
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
        required: true,
      },
      message: {
        type: String,
        required: true,
        maxlength: 250,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

ConversationSchema.set('timestamps', true);
