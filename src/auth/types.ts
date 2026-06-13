import { User } from 'src/user/entities/user.entity';

export interface Request extends Express.Request {
  user: User;
}
