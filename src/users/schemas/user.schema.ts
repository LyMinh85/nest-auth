import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type UserOauthProviderDocuemt = HydratedDocument<UserOauthProvider>;
export type UserDocument = HydratedDocument<User>;

@Schema()
export class UserOauthProvider {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  profileId: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OauthProvider' })
  // provider: OauthProvider;
  @Prop()
  provider: string;
}

export const UserOauthProviderSchema =
  SchemaFactory.createForClass(UserOauthProvider);

@Schema({ timestamps: true })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: false })
  avatar: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserOauthProvider' }],
    default: [],
  })
  providers: UserOauthProvider[];
}

export const UserSchema = SchemaFactory.createForClass(User);
