import { ofetch as fetchCustom } from 'ofetch'

const cookies = `sr_id=${process.env.SR_ID};`
type GiftSize = 'small' | 'medium'

const ofetch = fetchCustom.create({
  query: {
    _: new Date().getTime(),
  },
  headers: {
    'Referer': 'https://www.showroom-live.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  },
})

export function liveURL(key: string): string {
  return `https://www.showroom-live.com/r${key?.startsWith('/') ? '' : '/'}${key}`
}

export function avatarURL(id: number | string): string {
  return `https://image.showroom-cdn.com/showroom-prod/image/avatar/${id}.png`
}

export function giftUrl(id: string | number, type: GiftSize = 'small'): string {
  return `https://image.showroom-cdn.com/showroom-prod/assets/img/gift/${id}_${type === 'small' ? 's' : 'm'}.png`
}

export function profileURL(roomId: number | string): string {
  return `https://www.showroom-live.com/room/profile?room_id=${roomId}`
}

export function getProfile(roomId: number | string): Promise<ShowroomAPI.Profile> {
  return ofetch(`https://www.showroom-live.com/api/room/profile?room_id=${roomId}`)
}

export function getNextLive(roomId: number | string): Promise<ShowroomAPI.NextLive> {
  return ofetch(`https://www.showroom-live.com/api/room/next_live?room_id=${roomId}`)
}

export function getIsLive(roomId: number | string): Promise<ShowroomAPI.IsLive> {
  return ofetch(`https://www.showroom-live.com/room/is_live?room_id=${roomId}&_=${new Date().getTime()}`)
}

export function getGiftLog(roomId: number, cookies: string | null = null): Promise<{ gift_log: ShowroomAPI.GiftLogItem[] }> {
  return ofetch(`https://www.showroom-live.com/api/live/gift_log?room_id=${roomId}&_=${new Date().getTime()}`, { headers: { cookie: cookies || '' } })
}

export function getOnlives(query?: object, cookies: string | null = null): Promise<ShowroomAPI.Onlives> {
  return ofetch('https://www.showroom-live.com/api/live/onlives', { query, headers: { Cookie: cookies || '' } })
}

export function getRoomStatus(query: object, cookies: string | null = null): Promise<ShowroomAPI.RoomStatus> {
  return ofetch('https://www.showroom-live.com/api/room/status', { query, headers: { cookie: cookies || '' } })
}

export function getGiftList(roomId: number, cookies: string | null = null): Promise<{ normal: ShowroomAPI.Gift[] }> {
  return ofetch(`https://www.showroom-live.com/api/live/gift_list?room_id=${roomId}&_=${new Date().getTime()}`, { headers: { cookie: cookies || '' } })
}

export function getStreamingURL(query: object, cookies: string | null = null): Promise<ShowroomAPI.StreamingUrlList> {
  return ofetch('https://www.showroom-live.com/api/live/streaming_url', { query: { ...query }, headers: { cookie: cookies || '' } })
}
export function getCommentLog(roomId: number, cookies: string | null = null): Promise<{ comment_log: Watch.APIComment[] }> {
  return ofetch(`https://www.showroom-live.com/api/live/comment_log?room_id=${roomId}&_=${new Date().getTime()}`, { headers: { cookie: cookies || '' } })
}
export function getPolling(roomId: number, cookies: string | null = null): Promise<ShowroomAPI.Polling | ShowroomAPI.PollingLiveEnd> {
  return ofetch(`https://www.showroom-live.com/api/live/polling?room_id=${roomId}&_=${new Date().getTime()}`, { headers: { cookie: cookies || '' } })
}

export function getTelops(roomId: number, cookies: string | null = null): Promise<Watch.TelopApi> {
  return ofetch(`https://www.showroom-live.com/api/live/telop?room_id=${roomId}`, { headers: { cookie: cookies || '' } })
}

export function getUserProfile(userId: number | number): Promise<ShowroomAPI.UserProfile> {
  return ofetch(`https://www.showroom-live.com/api/user/profile?user_id=${userId}`)
}

export function getSummaryRanking(roomId: number): Promise<ShowroomAPI.SummaryRanking> {
  return ofetch(`https://www.showroom-live.com/api/live/summary_ranking?room_id=${roomId}`)
}

export function getStageUserList(roomId: number, cookies: string | null = null): Promise<Watch.StageList> {
  return ofetch('https://www.showroom-live.com/api/live/stage_user_list', { query: { room_id: roomId }, headers: { cookie: cookies || '' } })
}

export function sendComment(opts?: any | undefined): Promise<Watch.CommentResponse> {
  return ofetch('https://www.showroom-live.com/api/live/post_live_comment', { ...opts, method: 'POST' })
}

export function greeting(opts?: any | undefined): Promise<{ ok: 0 | 1 }> {
  return ofetch('https://www.showroom-live.com/api/room/greeting', { ...opts })
}

export function getShowroomCsrf(opts?: any | undefined): Promise<{ csrf_token: string }> {
  return ofetch('https://www.showroom-live.com/api/csrf_token', { ...opts })
}

export function getCurrentUser(opts?: any | undefined): Promise<ShowroomAPI.CurrentUser> {
  return ofetch('https://www.showroom-live.com/api/live/current_user', { ...opts })
}

export function logout(opts?: any | undefined): Promise<void> {
  return ofetch('https://www.showroom-live.com/user/logout_api', { ...opts, method: 'POST' })
}

export async function getFollows(page = 1): Promise<ShowroomAPI.Follow> {
  const count = 150
  const url = `https://www.showroom-live.com/api/follow/rooms?page=${page}&count=${count}&_=${new Date().getTime()}`
  const data = await ofetch(url, { headers: { cookie: cookies } })
  if (!('rooms' in data && 'next_page' in data && 'total_entries' in data && 'last_page' in data)) console.warn('Follow Api changes in some fields')
  if (!Array.isArray(data.rooms)) console.warn('Follow Api changes in some fields')
  return data
}

export async function getAllFollows(result: ShowroomAPI.RoomFollow[] = [], page = 1): Promise<ShowroomAPI.RoomFollow[]> {
  const data = await getFollows(page)
  result.push(...data.rooms)
  if (data.current_page !== page) return result
  if (data.next_page !== null) {
    return await getAllFollows(result, data.next_page)
  }
  else {
    return result
  }
}
