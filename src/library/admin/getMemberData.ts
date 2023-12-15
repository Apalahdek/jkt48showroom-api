import type { Context } from 'hono'
import Showroom from '@/database/schema/showroom/Showroom'
import { createError } from '@/utils/errorResponse'
import Member from '@/database/schema/48group/Member'
import JKT48Member from '@/database/showroomDB/jkt48/Member'

export async function getMemberDataForEdits(c: Context): Promise<Admin.ApiMemberEditData> {
  const room_id = c.req.query('room_id')
  const member = await Showroom.findOne({ room_id }).populate({
    path: 'member_data',
  })
    .lean() as Admin.IShowroomMember
  if (!member) throw createError({ status: 404, message: 'Member not found!' })

  const stage48members = await Member.find({}).lean()
  const jkt48members = await JKT48Member.find({}).lean()
  return {
    member,
    stage48members,
    jkt48members,
  }
}
