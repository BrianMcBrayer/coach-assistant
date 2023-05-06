export interface Player {
  id: string;
  name: string;
  additionalRotations: number;
  didPartialRotation: boolean;
  isIncapacitated: boolean;
}

export enum RotationStatus {
  NotStarted,
  InProgress,
  Complete,
}

export interface RotationPlayer {
  id: string;
  name: string;
  rotations: number;
}

export interface Rotation {
  id: string;
  players: RotationPlayer[];
  status: RotationStatus;
}
