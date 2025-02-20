// src/types/prismaTypes.ts
import { Prisma } from "@prisma/client";

/**
 * Extending Prisma Models with TypeScript Interfaces
 * Provides strongly-typed interfaces for use across the Next.js app.
 */

// 🧑‍💻 User Interface
export type IUser = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    username: true;
    catches: true;
    favoriteSpots: true;
    friendships: true;
    friendOf: true;
    comments: true;
    likes: true;
    notifications: true;
    privacy: true;
    auditLogs: true;
    oauthAccounts: true;
  };
}>;

// 🎣 Fish Species Interface
export type IFishSpecies = Prisma.FishSpeciesGetPayload<{
  select: { id: true; name: true; catches: true };
}>;

// 📍 Fishing Location Interface
export type ILocation = Prisma.LocationGetPayload<{
  select: { id: true; name: true; catches: true; favorites: true };
}>;

// 🎣 Fish Catch Interface
export type ICatch = Prisma.CatchGetPayload<{
  select: {
    id: true;
    user: true;
    species: true;
    location: true;
    weather: true;
    comments: true;
    likes: true;
  };
}>;

// ☁️ Weather Interface
export type IWeather = Prisma.WeatherGetPayload<{
  select: { id: true; conditions: true; catch: true };
}>;

// 📍 Favorite Fishing Locations Interface
export type IFavoriteLocation = Prisma.FavoriteLocationGetPayload<{
  select: { id: true; user: true; location: true };
}>;

// 👥 Friendships Interface
export type IFriendship = Prisma.FriendshipGetPayload<{
  select: { id: true; user: true; friend: true };
}>;

// 💬 Comments Interface
export type IComment = Prisma.CommentGetPayload<{
  select: { id: true; content: true; user: true; catch: true };
}>;

// 👍 Likes Interface
export type ILike = Prisma.LikeGetPayload<{
  select: { id: true; user: true; catch: true };
}>;

// 🔔 Notifications Interface
export type INotification = Prisma.NotificationGetPayload<{
  select: { id: true; message: true; user: true };
}>;

// 🔒 Privacy Settings Interface
export type IPrivacySettings = Prisma.PrivacySettingsGetPayload<{
  select: { id: true; user: true };
}>;

// 🔍 Audit Log Interface
export type IAuditLog = Prisma.AuditLogGetPayload<{
  select: { id: true; action: true; user: true };
}>;

// 🔑 OAuth Authentication Interface
export type IOAuthAccount = Prisma.OAuthAccountGetPayload<{
  select: { id: true; provider: true; user: true };
}>;
