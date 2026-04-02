export interface User {
  _id: string;
  name: string;
  email: string;
  platformRole: 'ADMIN' | 'USER';
  createdAt: string;
  teamCount: number;
  taskCount: number;
}

export interface Team {
  _id: string;
  name: string;
  description: string;
  ownerName: string;
  createdAt: string;
  memberCount: number;
  taskCount: number;
}

export interface Notice {
  _id: string;
  title: string;
  createdAt: string;
  createdBy: {
    name: string;
  };
}

export interface AdminData {
  users: User[];
  teams: Team[];
  notices: Notice[];
}