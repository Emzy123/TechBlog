# TechBlog - Modern Futuristic Blog Platform

A cutting-edge blog platform built with Next.js, featuring glassmorphism UI, admin dashboard, and modern web technologies.

## 🚀 Features

- **Modern Glassmorphism UI** - Futuristic design with glass effects and neon accents
- **Admin Dashboard** - Complete CRUD operations for blog posts
- **Rich Text Editor** - ReactQuill integration for content creation
- **Authentication** - JWT-based admin authentication system
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **SEO Optimized** - Server-side rendering with Next.js
- **Analytics Integration** - Google Analytics tracking
- **Monetization Ready** - Google AdSense integration
- **Database** - MongoDB Atlas with Mongoose ODM

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB Atlas, Mongoose
- **Authentication**: JWT, bcryptjs
- **Editor**: ReactQuill
- **Analytics**: Google Analytics
- **Monetization**: Google AdSense

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TechBlog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local` and update with your actual values:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techblog
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXTAUTH_SECRET=your-nextauth-secret-key
   
   # Google Services
   NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxxx
   NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   GOOGLE_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxxx
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

4. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env.local`

5. **Create an admin user**
   
   You'll need to manually create an admin user in your MongoDB database:
   ```javascript
   // Connect to your MongoDB and run this in MongoDB Compass or shell
   db.users.insertOne({
     username: "admin",
     email: "admin@techblog.com",
     password: "$2a$12$hash_your_password_here", // Use bcrypt to hash "admin123"
     role: "admin",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🎯 Usage

### For Visitors
- Browse blog posts on the homepage
- Filter posts by category
- Read individual blog posts
- Contact the admin via contact form

### For Admins
1. Go to `/login`
2. Use your admin credentials
3. Access the admin dashboard at `/admin`
4. Create, edit, and manage blog posts
5. Publish/unpublish posts
6. View analytics and statistics

## 📁 Project Structure

```
TechBlog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── posts/             # Blog post pages
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   └── login/             # Admin login
│   ├── components/            # Reusable components
│   │   ├── ui/                # UI components
│   │   ├── PostCard.tsx       # Blog post card
│   │   ├── AdSense.tsx        # AdSense components
│   │   └── Analytics.tsx      # Analytics tracking
│   ├── lib/                   # Utility libraries
│   │   ├── mongodb.ts         # Database connection
│   │   └── auth.ts            # Authentication utilities
│   └── models/                # Database models
│       ├── Post.ts            # Blog post model
│       └── User.ts            # User model
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── next.config.js             # Next.js configuration
```

## 🎨 Customization

### Colors and Theme
Edit `tailwind.config.ts` to customize the color scheme:
```typescript
colors: {
  'neon-blue': '#00f5ff',
  'neon-purple': '#8b5cf6',
  'neon-pink': '#f472b6',
}
```

### Content Categories
Update categories in:
- `src/models/Post.ts` (database schema)
- `src/app/admin/posts/new/page.tsx` (post creation)
- `src/app/admin/posts/[id]/page.tsx` (post editing)

## 🔧 Configuration

### Google Analytics
1. Create a Google Analytics property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Update `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` in `.env.local`

### Google AdSense
1. Apply for Google AdSense
2. Get your Publisher ID (ca-pub-xxxxxxxxxxxxxxxxx)
3. Update `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID` in `.env.local`
4. Customize ad placements in components

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Configure build command as `npm run build`
- **Railway**: Add environment variables and deploy
- **DigitalOcean**: Use App Platform with Node.js

## 📝 Content Management

### Creating Posts
1. Login to admin dashboard
2. Click "Create New Post"
3. Fill in title, excerpt, thumbnail URL, category
4. Write content using the rich text editor
5. Add tags (comma-separated)
6. Publish or save as draft

### Managing Posts
- View all posts in the admin dashboard
- Edit existing posts
- Toggle publish/unpublish status
- Delete posts
- View post statistics

## 🔒 Security

- JWT-based authentication
- Password hashing with bcryptjs
- Admin-only routes protection
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📊 Analytics & Monetization

### Analytics Features
- Page view tracking
- User interaction events
- Post engagement metrics
- Admin activity logging

### Monetization
- Google AdSense integration
- Multiple ad placement options
- Responsive ad units
- Revenue optimization ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact via the website contact form
- Email: support@techblog.com

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS
- Framer Motion for smooth animations
- MongoDB for the database solution
- All open-source contributors

---

**Built with ❤️ using modern web technologies**
