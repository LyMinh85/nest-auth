import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OauthProviderDocument = HydratedDocument<OauthProvider>;

@Schema()
export class OauthProvider {
  @Prop()
  id: string;

  @Prop()
  name: string;
}

export const OauthProviderSchema = SchemaFactory.createForClass(OauthProvider);
