export type Team = {
  teamId: string;
  name: string;
  description: string;
  color: string;
  role?: string;
};

export type CreateTeamInput = {
  name: string;
  description: string;
  color: string;
};