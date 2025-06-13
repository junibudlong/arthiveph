# ArtHivePH

ArtHivePH is a mobile-compatible web application that empowers Filipino artists to showcase, sell, and manage their creative work, while engaging with supporters and collaborators.

## 🚀 Features

* **Authentication**: Email/password + Google OAuth via Supabase
* **Profiles**: Artist & user roles, customizable username, bio, and avatar upload
* **Artist Onboarding**: "Become an Artist" request flow with admin approval
* **Product Display**: Carousel and grid of merch items fetched from Supabase
* **Cart & Checkout**: (Upcoming) Stripe integration for payments
* **Admin Dashboard**: Approve artist applications

## 🛠 Tech Stack

* **Frontend:** Next.js 15 (App Router), Tailwind CSS
* **Backend:** Supabase (PostgreSQL, Auth, Storage)
* **Deployment:** Vercel (CI/CD via GitHub)
* **Language:** TypeScript

## 📦 Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/arthiveph.git
   cd arthiveph
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   * Copy `.env.example` → `.env.local`
   * Fill in the values:

     ```env
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     STRIPE_PUBLIC_KEY=your-stripe-pk
     STRIPE_SECRET_KEY=your-stripe-sk
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/arthiveph
├── app/               # Next.js App Router pages
│   ├── api/           # API routes (including admin endpoints)
│   ├── admin/         # Admin pages
│   ├── cart/          # Cart and checkout
│   ├── login/         # Login/signup flows
│   └── ...            # Other routes
├── components/        # Shared UI components (Navbar, etc.)
├── hooks/             # Custom React hooks (useUser, useRole)
├── lib/               # Supabase client & helpers
├── public/            # Static assets
├── styles/            # Global & tailwind styles
├── .env.example       # Environment variable template
├── .gitignore
├── README.md
├── next.config.js
└── package.json
```

## ✅ Next Steps

1. **ESLint & Prettier**: Add linting and formatting
2. **Stripe Checkout**: Implement cart & payment flow
3. **Testing**: Set up Jest/Vitest for unit and integration tests
4. **CI/CD**: Configure GitHub Actions and Vercel previews

## 🤝 Contributing

Feel free to open issues or pull requests! Label features or bugs in GitHub Issues.

---

© 2025 ArtHivePH

