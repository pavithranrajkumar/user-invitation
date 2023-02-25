import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.model';

@Schema()
export class Invitation extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  invitationCode: string;

  @Prop({ default: 'pending' })
  status: 'failed' | 'pending' | 'accepted' | 'rejected';

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  sentBy: User;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
