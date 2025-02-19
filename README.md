# 🌟 **Amaymani - Oh Muse!** 🌟

Welcome to **Amaymani - Oh Muse!**, a vibrant and dynamic social platform designed to inspire creativity, foster communities, and connect like-minded individuals. Whether you're here to share your thoughts, discover new communities, or engage with others, Amaymani is your go-to space for meaningful interactions.

---

## 🚀 **Features**

- **Community Creation**: Build and manage your own communities around shared interests.
- **Post Engagement**: Share your thoughts, ideas, and creativity through posts, and engage with others through likes and comments.
- **Discover Communities**: Explore trending communities and find your tribe.
- **User Profiles**: Customize your profile, showcase your interests, and connect with followers.
- **Trending Section**: Stay updated with the latest trends and popular posts.
- **Search & Explore**: Easily search for users, communities, and posts.
- **Authentication**: Secure login and registration with NextAuth.

---

## 🛠️ **Tech Stack**

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Styling**: Tailwind CSS, PostCSS

---

## 📂 **Directory Structure**

```plaintext
amaymani-oh-muse/
├── README.md
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
├── public/
│   └── pfp.webp
└── src/
    ├── components/
    │   ├── AuthArt.js
    │   ├── Brand.js
    │   ├── CreateCommunity.js
    │   ├── ExploreCommunities.js
    │   ├── FollowerModel.js
    │   ├── Footer.js
    │   ├── Navbar.js
    │   ├── PostEngagement.js
    │   ├── ProfileHeader.js
    │   ├── SearchCommunity.js
    │   └── TrendingSection.js
    ├── lib/
    │   ├── dbConnect.js
    │   ├── s3Client.js
    │   └── models/
    │       ├── community.js
    │       ├── post.js
    │       └── user.js
    ├── pages/
    │   ├── _app.js
    │   ├── _document.js
    │   ├── community.js
    │   ├── create-a-community.js
    │   ├── create-a-post.js
    │   ├── discover.js
    │   ├── edit-profile.js
    │   ├── index.js
    │   ├── login.js
    │   ├── profile.js
    │   ├── register.js
    │   ├── api/
    │   │   ├── add-like-comments.js
    │   │   ├── community.js
    │   │   ├── create-a-community.js
    │   │   ├── create-a-post.js
    │   │   ├── delete-post.js
    │   │   ├── fetch-communities.js
    │   │   ├── fetch-followers-following.js
    │   │   ├── fetch-followings-posts.js
    │   │   ├── fetch-posts.js
    │   │   ├── follow.js
    │   │   ├── join-community.js
    │   │   ├── search-user.js
    │   │   ├── auth/
    │   │   │   └── [...nextauth].js
    │   │   ├── edit-profile/
    │   │   │   └── index.js
    │   │   ├── login/
    │   │   │   └── index.js
    │   │   ├── profile/
    │   │   │   └── index.js
    │   │   └── register/
    │   │       └── index.js
    │   ├── community/
    │   │   ├── [community_id].js
    │   │   └── [community_id]/
    │   │       └── create-community-post.js
    │   └── profile/
    │       └── [username].js
    └── styles/
        └── globals.css
```

---

## 🧩 **Components**

- **AuthArt.js**: Artistic component for authentication pages.
- **Brand.js**: Branding and logo component.
- **CreateCommunity.js**: Form and logic for creating new communities.
- **ExploreCommunities.js**: Discover and join new communities.
- **FollowerModel.js**: Manage followers and following.
- **Footer.js**: Footer component for the app.
- **Navbar.js**: Navigation bar for easy access to different sections.
- **PostEngagement.js**: Engage with posts through likes and comments.
- **ProfileHeader.js**: Header component for user profiles.
- **SearchCommunity.js**: Search functionality for communities.
- **TrendingSection.js**: Display trending posts and communities.

---

## 📄 **Pages**

- **Home**: Landing page with trending posts and communities.
- **Login**: User authentication page.
- **Register**: User registration page.
- **Profile**: User profile page with customizable options.
- **Community**: Community page with posts and engagement options.
- **Create Community**: Page to create a new community.
- **Create Post**: Page to create a new post.
- **Discover**: Explore new communities and posts.
- **Edit Profile**: Edit and update user profile information.

---

## 🔧 **Setup & Installation**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/amaymani-oh-muse.git
   cd amaymani-oh-muse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the necessary environment variables:
   ```plaintext
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`.

---

## 🤝 **Contributing**

We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌐 **Connect with Us**

- **Website**: [Amaymani](https://amaymani.com)
- **Twitter**: [@Amaymani](https://twitter.com/Amaymani)
- **GitHub**: [Amaymani](https://github.com/Amaymani)

---

Thank you for visiting **Amaymani - Oh Muse!** We hope you enjoy your time here and find inspiration in every corner. Happy creating! 🎨✨
