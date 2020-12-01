// @ts-nocheck

import mongoose from 'mongoose';

import { Password } from '../services';

// User attributes
interface UserAttributes {
  email: string;
  password: string;
}
// User model properties
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttributes): UserDocument;
}
// User document properties
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;

        delete ret.password;
        delete ret._id;
      },
    },
  }
);
UserSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};
UserSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));

    this.set('password', hashed);
  }
});

const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);

export { UserSchema, User };
