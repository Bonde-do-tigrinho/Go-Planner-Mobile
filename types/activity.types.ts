export type Activity = {
  id: string;
  title: string;
  time: string; // "HH:MM"
  date: string; // "YYYY-MM-DD"
  tripId: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateActivity = {
  title: string;
  time: string; // "HH:MM"
  date: string; // "YYYY-MM-DD"
  completed: boolean;
  tripId: string
}

export type UpdateActivity = Partial<Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>>;

