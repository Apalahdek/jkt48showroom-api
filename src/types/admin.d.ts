declare namespace Admin {
  type I48Member = Database.I48Member & { _id: string | null }
  type IShowroomMember = Omit<Database.IShowroomMember, 'member_data'> & {
    _id: string
    member_data: null | I48Member
  }
  interface MissingJiko {
    name?: string
    img?: string
    img_alt?: string
    member_id: string
    room_id: number
    url: string
  }

  interface MissingJKT48ID {
    _id: string
    name: string
    img: string
    generation?: string
    isGraduate: boolean
  }

  interface JKT48MemberId {
    id: string
    name: string
  }

  interface ApiMissingJKT48ID {
    members: MissingJKT48ID[]
    jkt48members: JKT48MemberId[]
  }

  interface ApiMemberEditData {
    member: IShowroomMember
    stage48members: IdolMember[]
    jkt48members: JKT48.Member[]
  }
}
