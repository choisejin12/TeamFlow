import { Team } from './team';
import { Task } from './task';

export type Member = {
  name: string;
  email: string;
  role: string;
  userId: string;
};

export type DetailTeam = {
  team: Team & {
    myRole: string;
  };
  members: Member[];
  myTasks: Task[];
  teamTasks: any[];
};