
export type ActivityType =
  | 'TEAM_CREATE'
  | 'MEMBER_ADD'
  | 'NOTICE_CREATE';

  export type Activity = {
  _id: string;
  type: ActivityType;
  message: string;
  teamId?: {
    name: string;
  };
};