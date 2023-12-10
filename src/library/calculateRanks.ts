import { calculateFansPoints } from './fansPoints'

export function calculateRanks(logs: Database.IShowroomLog[], stageListData: Database.IStageListItem[]): Stats.CalculatedRanks {
  const memberRanks: Map<string | number, Stats.IStatMember> = new Map()

  for (const log of logs) {
    if (memberRanks.has(log.room_id)) {
      const member = memberRanks.get(log.room_id)
      if (member) {
        const viewer = log.live_info?.viewers?.peak ?? 0
        const duration = new Date(log?.live_info?.end_date).getTime() - new Date(log?.live_info?.start_date).getTime()
        member.live_count += 1
        member.total_viewer += log?.live_info?.viewers?.peak ?? 0
        member.point += log.total_point
        member.most_viewer = viewer > member.most_viewer ? viewer : member.most_viewer
        member.duration = duration > member.duration ? duration : member.duration
        member.most_point = log?.total_point > member.most_point ? log?.total_point : member.most_point
      }
    }
    else {
      memberRanks.set(log.room_id, {
        room_id: log.room_id,
        name: log.room_info?.name ?? 'Member not Found!',
        img:
            log.room_info?.member_data?.img
            || log.room_info?.img
            || 'https://image.showroom-cdn.com/showroom-prod/assets/img/v3/img-err-404.jpg?t=1602821561',
        url: log.room_info?.url ?? '',
        live_count: 1,
        total_viewer: log?.live_info?.viewers?.peak ?? 0,
        duration: new Date(log?.live_info?.end_date).getTime() - new Date(log?.live_info?.start_date).getTime(),
        point: log.total_point,
        most_viewer: log.live_info?.viewers?.peak ?? 0,
        most_point: log.total_point,
      })
    }
  }

  const users = logs.reduce<RecentDetails.IFansCompact[]>((a, b) => {
    for (const user of b.users) {
      a.push({
        name: user.name,
        avatar_id: user.avatar_id,
        id: user.user_id,
      })
    }
    return a
  }, [] as RecentDetails.IFansCompact[])

  const stageList = stageListData.reduce<Database.IStage[]>((a, b) => {
    a.push(...(b.stage_list ?? []))
    return a
  }, [] as RecentDetails.IStageList[])

  return {
    member: Array.from(memberRanks.values()).sort((a, b) => b.point - a.point),
    fans: calculateFansPoints(users, stageList),
  }
}