export interface LinkItem {
  id: string
  description: string
  url: string
  votes?: [Vote]
  postedBy?: User
  createdAt: Date
}

export interface Vote {
  id: string
  user: User
}

export interface User {
  id: string
  name: string
}
