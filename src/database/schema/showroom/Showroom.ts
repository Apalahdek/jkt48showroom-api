import { Schema, model } from 'mongoose'
import type { Model } from 'mongoose'
import Member from '../48group/Member'
import Theater from '../../showroomDB/jkt48/Theater'

const ShowroomSchema = new Schema<Database.IShowroomMember>({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  img_square: {
    type: String,
  },
  description: {
    type: String,
  },
  group: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  room_id: {
    type: Number,
    required: true,
    unique: true,
  },
  room_exists: {
    type: Boolean,
    default: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  generation: {
    type: String,
  },
  is_group: {
    type: Boolean,
    default: false,
  },
  member_data: {
    type: Schema.Types.ObjectId,
    ref: Member,
  },
})

export default model<Database.IShowroomMember>('Showroom', ShowroomSchema)
