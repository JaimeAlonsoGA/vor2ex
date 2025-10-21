import { Strategy, User } from './index'

export interface UserWithStrategy extends Omit<User, 'strategy'> {
    strategy: Strategy
}
