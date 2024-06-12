import mongoose, { Document, Schema } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  user: Schema.Types.ObjectId;
  location: string;
}

const RefreshTokenSchema: Schema = new Schema({
  token: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: '7d' },
  location: {type: String, required: true}
});

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
