# Fishly

Fishly is a fishing companion app built with Next.js, designed to provide real-time fishing insights, catch logging, and location-based recommendations. The goal of Fishly is to enhance the fishing experience by leveraging modern web technologies to deliver useful data and social features for anglers.

## 🚀 Features (Planned & Available)

### ✅ Currently Available:

- **User Login & Authentication** – Secure sign-in to personalize your fishing experience.
- **Interactive Landing Page** – Explore the app's features with a clean and modern UI.

### 🔜 Upcoming Features:

- **Real-Time Fishing Conditions** – Get live weather, tide, and moon phase data to optimize fishing trips.
- **Catch Logging & History** – Track your catches, including species, location, and bait used.
- **Location-Based Fishing Spots** – Discover top-rated fishing locations based on user data.
- **AI-Powered Fishing Insights** – Receive predictive insights on the best times and locations to fish.
- **Social Sharing & Community** – Share your catches, tips, and fishing experiences with others.
- **Ad-Supported Free Structure** – Fishly will operate with minimal, non-intrusive ads to keep the platform free.

## 🛠 Getting Started

## 🌐 API

Fishly uses **Next.js API routes** to handle backend operations, including user authentication and data fetching. These API routes interact with the **Prisma ORM** to perform database operations on **Neon PostgreSQL**. The API is structured within the Next.js project, allowing seamless integration between the frontend and backend.

First, clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/fishly.git
cd fishly
npm install
```

Then, start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄 Database

Fishly uses **Prisma** as the ORM and **Neon** for the PostgreSQL database.

To set up the database:

1. Ensure you have a Neon database instance.
2. Configure the `.env` file with your Neon database URL:
   ```env
   DATABASE_URL="postgresql://yourusername:yourpassword@your-neon-db-instance-url/dbname"
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. View the database tables locally using Prisma Studio:
   ```bash
   npx prisma studio
   ```
5. Check the database schema:
   ```bash
   npx prisma db pull
   ```
6. Apply changes to the database:
   ```bash
   npx prisma db push
   ```

Fishly uses **Prisma** as the ORM and **Neon** for the PostgreSQL database.

To set up the database:

1. Ensure you have a Neon database instance.
2. Configure the `.env` file with your Neon database URL:
   ```env
   DATABASE_URL="postgresql://yourusername:yourpassword@your-neon-db-instance-url/dbname"
   ```
3. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

## 📚 Learn More

To learn more about the technologies used in Fishly, check out:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Tailwind CSS](https://tailwindcss.com) - A utility-first CSS framework for styling.
- [Prisma](https://www.prisma.io) - Modern ORM for working with databases.
- [Neon](https://neon.tech) - Serverless Postgres database platform.
- [Vercel](https://vercel.com) - The hosting platform for deploying Fishly.

## 🚀 Deployment

Fishly can be deployed using [Vercel](https://vercel.com/new) for seamless Next.js integration.

To deploy manually:

```bash
git push origin main
```

Then, follow the deployment process on Vercel.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## 📄 License

MIT License - See [LICENSE](LICENSE) for more details.

---

Stay tuned for updates as we continue developing and rolling out new features! 🎣

