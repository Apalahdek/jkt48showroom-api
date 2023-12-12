import { getCommentLog, getCurrentUser, getGiftList, getGiftLog, getRoomStatus, getStreamingURL } from '@utils/showroomAPI'
import type { Context } from 'hono'

export async function getWatchData(c: Context) {
  const srId = c.get('user')?.sr_id
  return await getData({ room_url_key: c.req.param('id') }, `sr_id=${srId};`)
}

async function getData(params: object, cookies?: string | undefined): Promise<Watch.WatchData> {
  const data = await getRoomStatus(params, cookies)
  const streamUrl = data.is_live ? (await getStreamingURL({ room_id: data.room_id }, cookies)).streaming_url_list : []
  const comments = (data.is_live ? (await getCommentLog(data.room_id, cookies)).comment_log : []).filter(i => !(!Number.isNaN(i.comment) && Number.parseInt(i.comment) <= 50))
  const giftLog = (data.is_live ? (await getGiftLog(data.room_id, cookies)).gift_log : [])
  const giftList = (data.is_live ? (await getGiftList(data.room_id, cookies)).normal : [])
  const activateComment = (cookies
    ? (await getCurrentUser({
        headers: {
          cookie: cookies || '',
        },
        params: {
          room_id: data.room_id,
        },
      }).catch(_ => null))
    : null)
  return {
    name: data.room_name,
    started_at: data.started_at,
    can_comment: data.can_comment,
    live_id: data.live_id,
    room_id: data.room_id,
    streaming_url_list: streamUrl,
    socket_host: data.broadcast_host,
    socket_key: data.broadcast_key,
    socket_port: data.broadcast_port,
    room_url_key: data.room_url_key,
    image: data.image_s,
    is_live: data.is_live,
    gift_log: giftLog,
    gift_list: giftList,
    user: {
      id: activateComment?.user_id || 0,
      name: activateComment?.name || null,
      avatar_id: activateComment?.avatar_id || 0,
    },
    comments: comments.map((i) => {
      return <Watch.Comment>{
        id: i.user_id.toString() + i.created_at.toString(),
        user_id: i.user_id,
        name: i.name,
        comment: i.comment,
        created_at: i.created_at,
        avatar_id: i.avatar_id,
      }
    }),
  }
}
