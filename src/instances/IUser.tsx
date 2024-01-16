export interface IUser {
  id: string;
  uid: string;
  email: string;
  password: string;
  displayName: string;
  thumbnail: File;
  photoURL: string;
  online: boolean;
  createdAt: Date;
}
