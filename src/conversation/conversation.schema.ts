import * as mongoose from 'mongoose';

export const ConversationSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ['PERSONAL', 'GROUP'],
    default: 'PERSONAL',
    required: true,
  },
  name: {
    type: String,
    maxlength: 22,
    required: false,
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
      reactions: [
        {
          by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          reaction: {
            type: String,
            enum: [
              'HAIZT',
              'SHIT',
              'FU',
              'ROCK',
              'CRYING',
              'ANGRY',
              'SHOCKED',
              'CLAP',
              'LOVE',
              'LAUGH',
              'AGREE',
              'DISAGREE',
              'TOUNGE',
              'THINKING',
            ],
          },
        },
      ],
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

ConversationSchema.set('timestamps', true);
