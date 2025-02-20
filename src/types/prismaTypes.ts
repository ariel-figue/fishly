// src/types/prismaTypes.ts
import { Prisma } from "@prisma/client";

/**
 * Extending Prisma Models with TypeScript Interfaces
 * Provides strongly-typed interfaces for use across the Next.js app.
 */

// 🧑‍💻 User Interface
export type IUser = Prisma.UserGetPayload<{
  include: {
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
  include: { catches: true };
}>;

// 📍 Fishing Location Interface
export type ILocation = Prisma.LocationGetPayload<{
  include: { catches: true; favorites: true };
}>;

// 🎣 Fish Catch Interface
export type ICatch = Prisma.CatchGetPayload<{
  include: {
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
  include: { catch: true };
}>;

// 📍 Favorite Fishing Locations Interface
export type IFavoriteLocation = Prisma.FavoriteLocationGetPayload<{
  include: { user: true; location: true };
}>;

// 👥 Friendships Interface
export type IFriendship = Prisma.FriendshipGetPayload<{
  include: { user: true; friend: true };
}>;

// 💬 Comments Interface
export type IComment = Prisma.CommentGetPayload<{
  include: { user: true; catch: true };
}>;

// 👍 Likes Interface
export type ILike = Prisma.LikeGetPayload<{
  include: { user: true; catch: true };
}>;

// 🔔 Notifications Interface
export type INotification = Prisma.NotificationGetPayload<{
  include: { user: true };
}>;

// 🔒 Privacy Settings Interface
export type IPrivacySettings = Prisma.PrivacySettingsGetPayload<{
  include: { user: true };
}>;

// 🔍 Audit Log Interface
export type IAuditLog = Prisma.AuditLogGetPayload<{
  include: { user: true };
}>;

// 🔑 OAuth Authentication Interface
export type IOAuthAccount = Prisma.OAuthAccountGetPayload<{
  include: { user: true };
}>;
