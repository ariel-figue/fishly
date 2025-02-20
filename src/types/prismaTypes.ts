// src/types/prismaTypes.ts

/**
 * Extending Models with TypeScript Interfaces
 * Provides strongly-typed interfaces for use across the Next.js app.
 */

// 🧑‍💻 User Interface
export interface IUser {
  id: string;
  email: string;
  username: string;
  catches?: ICatch[];
  favoriteSpots?: ILocation[];
  friendships?: IFriendship[];
  friendOf?: IFriendship[];
  comments?: IComment[];
  likes?: ILike[];
  notifications?: INotification[];
  privacy?: IPrivacySettings;
  auditLogs?: IAuditLog[];
  oauthAccounts?: IOAuthAccount[];
}

// 🎣 Fish Species Interface
export interface IFishSpecies {
  id: string;
  name: string;
  catches?: ICatch[];
}

// 📍 Fishing Location Interface
export interface ILocation {
  id: string;
  name: string;
  catches?: ICatch[];
  favorites?: IFavoriteLocation[];
}

// 🎣 Fish Catch Interface
export interface ICatch {
  id: string;
  user: IUser;
  species: IFishSpecies;
  location?: ILocation;
  weather?: IWeather;
  comments?: IComment[];
  likes?: ILike[];
}

// ☁️ Weather Interface
export interface IWeather {
  id: string;
  conditions: string;
  catch?: ICatch;
}

// 📍 Favorite Fishing Locations Interface
export interface IFavoriteLocation {
  id: string;
  user: IUser;
  location: ILocation;
}

// 👥 Friendships Interface
export interface IFriendship {
  id: string;
  user: IUser;
  friend: IUser;
}

// 💬 Comments Interface
export interface IComment {
  id: string;
  content: string;
  user: IUser;
  catch?: ICatch;
}

// 👍 Likes Interface
export interface ILike {
  id: string;
  user: IUser;
  catch?: ICatch;
}

// 🔔 Notifications Interface
export interface INotification {
  id: string;
  message: string;
  user: IUser;
}

// 🔒 Privacy Settings Interface
export interface IPrivacySettings {
  id: string;
  user: IUser;
}

// 🔍 Audit Log Interface
export interface IAuditLog {
  id: string;
  action: string;
  user: IUser;
}

// 🔑 OAuth Authentication Interface
export interface IOAuthAccount {
  id: string;
  provider: string;
  user: IUser;
}
