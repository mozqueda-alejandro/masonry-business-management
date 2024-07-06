import type { Avatar } from '#ui/types'

interface User {
    id: number
    name: string
    email: string
    avatar?: Avatar
    status: 'subscribed' | 'unsubscribed' | 'bounced'
    location: string
}

interface Notification {
    id: number
    unread?: boolean
    sender: User
    body: string
    date: string
}

enum Screen {
    Estimates,
    NewEstimate
}

export { User, Notification, Screen };
