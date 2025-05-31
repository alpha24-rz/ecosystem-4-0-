# Ecosystem 4.0 - Environmental NFT Platform

![Ecosystem 4.0 Logo](public/logo.png)

A revolutionary platform that combines environmental conservation with blockchain technology, allowing users to earn NFT rewards for their environmental contributions.

## 🌍 Features

### For Users
- **Environmental Projects**: Participate in tree planting, ocean cleanup, and urban gardening initiatives
- **NFT Rewards**: Earn unique NFTs for your environmental contributions
- **Impact Tracking**: Monitor your environmental impact and contributions
- **Community**: Connect with like-minded environmental enthusiasts
- **Educational Content**: Access articles and resources about environmental conservation

### For Administrators
- **Comprehensive Dashboard**: Monitor platform statistics and user activity
- **Project Management**: Create and manage environmental projects
- **NFT Management**: Mint, manage, and track NFTs
- **User Management**: Manage user accounts and permissions
- **Content Management**: Create and publish educational articles
- **Analytics**: Track platform performance and user engagement

## 🚀 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: Firebase Auth
- **Database**: MongoDB Atlas
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Git

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/ecosystem40/platform.git
   cd platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables in `.env.local`:
   - Firebase configuration
   - MongoDB connection string
   - Other API keys as needed

4. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password, Google, and Twitter providers
   - Enable Firestore Database
   - Copy your Firebase configuration to `.env.local`

5. **Set up MongoDB**
   - Create a MongoDB Atlas account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string and add it to `.env.local`

6. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Set up admin account**
   \`\`\`bash
   npm run setup-admin
   \`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔧 Configuration

### Firebase Setup

1. **Authentication**
   - Enable Email/Password authentication
   - Enable Google authentication
   - Enable Twitter authentication (optional)

2. **Firestore Rules**
   \`\`\`javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow read: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
       }
       
       match /{document=**} {
         allow read, write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'super_admin'];
       }
     }
   }
   \`\`\`

### MongoDB Collections

The application uses the following MongoDB collections:
- `users` - User profiles and authentication data
- `projects` - Environmental projects
- `nfts` - NFT metadata and ownership
- `articles` - Blog posts and educational content

## 🚀 Deployment

### Deploy to Vercel

1. **Connect to Vercel**
   \`\`\`bash
   npm i -g vercel
   vercel
   \`\`\`

2. **Set environment variables in Vercel dashboard**
   - Go to your project settings in Vercel
   - Add all environment variables from `.env.local`

3. **Deploy**
   \`\`\`bash
   vercel --prod
   \`\`\`

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📁 Project Structure

\`\`\`
ecosystem-4-0/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── user/              # User dashboard
│   └── ...                # Other pages
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   └── ui/               # UI components
├── lib/                  # Utility functions and configurations
│   ├── models/           # TypeScript interfaces
│   ├── firebase.ts       # Firebase configuration
│   └── mongodb.ts        # MongoDB configuration
├── hooks/                # Custom React hooks
├── scripts/              # Utility scripts
└── public/               # Static assets
\`\`\`

## 🔐 Authentication & Authorization

The platform uses Firebase Authentication with role-based access control:

- **User**: Can participate in projects and view their NFTs
- **Admin**: Can manage projects, NFTs, users, and content
- **Super Admin**: Full system access

### Admin Setup

To create an admin account:

1. Run the setup script:
   \`\`\`bash
   npm run setup-admin
   \`\`\`

2. Or manually create an admin account:
   - Sign up with email: `alfakiddrock7@gmail.com`
   - Password: `kampasrem`
   - The system will automatically assign admin role

## 🎨 Customization

### Theming

The application supports light and dark themes using `next-themes`. Customize colors in:
- `app/globals.css` - Global styles and CSS variables
- `tailwind.config.ts` - Tailwind configuration

### Components

All UI components are built with Radix UI and can be customized in the `components/ui/` directory.

## 📊 API Documentation

### NFTs API

- `GET /api/nfts` - Get all NFTs with filtering and pagination
- `POST /api/nfts` - Create a new NFT
- `GET /api/nfts/[id]` - Get specific NFT
- `PUT /api/nfts/[id]` - Update NFT
- `DELETE /api/nfts/[id]` - Delete NFT

### Projects API

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get specific project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Articles API

- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create a new article
- `GET /api/articles/[id]` - Get specific article
- `PUT /api/articles/[id]` - Update article
- `DELETE /api/articles/[id]` - Delete article

### Users API

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user

## 🧪 Testing

\`\`\`bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run tests (when implemented)
npm test
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or need help:

1. Check the [Issues](https://github.com/ecosystem40/platform/issues) page
2. Create a new issue with detailed information
3. Contact support at support@ecosystem40.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Firebase](https://firebase.google.com/) - Backend-as-a-Service platform
- [MongoDB](https://www.mongodb.com/) - Document database
- [Vercel](https://vercel.com/) - Deployment platform

## 🌟 Roadmap

- [ ] Web3 wallet integration
- [ ] Real blockchain NFT minting
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced search functionality
- [ ] Real-time notifications
- [ ] Social features
- [ ] Gamification elements

---

Made with ❤️ for the environment by the Ecosystem 4.0 team.
\`\`\`

Mari buat file untuk production deployment:
