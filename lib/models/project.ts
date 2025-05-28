export interface Project {
  _id?: string
  name: string
  description: string
  category: string
  location: string
  status: "active" | "paused" | "completing" | "completed"
  progress: number
  target: number
  current: number
  participants: number
  startDate: string
  endDate: string
  budget: string
  spent: string
  manager: string
  image?: string
  createdAt: Date
  updatedAt: Date
}
