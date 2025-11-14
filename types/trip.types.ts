import { Activity } from "./activity.types";

export type Trip = {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  guests?: Guest[];
  activities?: Activity[]
  createdAt: string;
  updatedAt: string;
};

export type Guest = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

export type CreateTripDTO = {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
};

export type UpdateTripDTO = Partial<Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>>;