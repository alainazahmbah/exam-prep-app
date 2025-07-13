# GCE Preparation App for Cameroon Students

A comprehensive mobile-first application designed to help secondary school students in Cameroon prepare for their GCE (General Certificate of Education) exams at both O-Level and A-Level.

## 🎯 Overview

This app provides students with access to past GCE questions, interactive practice quizzes, progress tracking, and study resources - all optimized for mobile devices with offline capabilities.

## ✨ Features

### 👨‍🎓 Student Features
- **Past GCE Questions**: Access organized past papers by year and subject (O-Level & A-Level)
- **Practice Mode**: Timed quizzes with instant corrections and explanations
- **Progress Tracking**: Detailed analytics per subject with score history
- **Offline Mode**: Download content for studying without internet
- **Bookmarks**: Save questions and create custom practice sets
- **Multi-language**: Full English and French support
- **Gamification**: Leaderboards and achievement system

### 👨‍🏫 Teacher/Contributor Features
- **Content Upload**: Add questions, solutions, and video tutorials
- **Student Interaction**: Q&A support and progress monitoring
- **Content Management**: Organize and categorize study materials

### 🔧 Admin Features
- **User Management**: Manage students, teachers, and content
- **Analytics Dashboard**: Monitor app usage and performance
- **Content Moderation**: Review and approve user-generated content
- **Announcements**: Push notifications for important updates

## 🏗️ Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Context API
- **Navigation**: Expo Router
- **Charts**: React Native Chart Kit
- **Icons**: Lucide React Native
- **Styling**: StyleSheet (Native)

## 📱 Supported Platforms

- **Primary**: Android (Mobile-first design)
- **Secondary**: iOS, Web (Responsive)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gce-prep-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   - Scan QR code with Expo Go app (mobile)
   - Press 'w' to open in web browser

## 🗄️ Database Setup

The app uses Supabase with the following main tables:

### Core Tables
- `users` - User profiles (students, teachers, admins)
- `subjects` - GCE subjects with metadata
- `questions` - Past paper questions with answers
- `quizzes` - Quiz attempts and scores
- `progress` - Learning analytics per subject
- `content` - Video tutorials and study materials

### Setup Instructions

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Copy URL and anon key to `.env`

2. **Run Database Migrations**
   ```sql
   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
   ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
   
   -- Create policies for data access
   CREATE POLICY "Users can read own data" ON users
     FOR SELECT USING (auth.uid() = id);
   ```

## 📚 Subject Categories

### Sciences
- Mathematics
- Physics  
- Chemistry
- Biology

### Arts
- English Language
- Literature
- Geography
- History

### Commercial
- Economics
- Accounting
- Business Studies

## 🎮 User Roles & Permissions

### Student
- Access past papers and practice quizzes
- Track personal progress
- Bookmark questions
- Download offline content

### Teacher/Contributor
- Upload questions and solutions
- Create video tutorials
- Moderate student discussions
- View student progress (with permission)

### Admin
- Full system access
- User management
- Content moderation
- Analytics and reporting

## 🌐 Internationalization

The app supports Cameroon's bilingual education system:

- **English**: Primary interface language
- **French**: Full translation for francophone students
- **Content**: Questions and explanations in both languages

## 📱 Mobile Features

### Offline Mode
- Download past papers as PDFs
- Cache quiz questions for offline practice
- Sync progress when connection restored

### Performance
- Optimized for low-end Android devices
- Minimal data usage
- Fast loading with image optimization

## 🔒 Security & Privacy

- **Authentication**: Secure email/password with Supabase Auth
- **Data Protection**: Row Level Security (RLS) policies
- **Privacy**: GDPR-compliant data handling
- **Content Safety**: Moderated user-generated content

## 🚀 Deployment

### Mobile App
```bash
# Build for Android
expo build:android

# Build for iOS  
expo build:ios
```

### Web App
```bash
# Build for web
npm run build:web
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines
- Follow React Native best practices
- Write tests for new features
- Update documentation
- Ensure mobile-first responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)
- **Email**: support@gceprep.cm
- **Community**: [Discord](link-to-discord)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core authentication system
- ✅ Basic quiz functionality
- ✅ Progress tracking
- ✅ Multi-language support

### Phase 2 (Next)
- 🔄 Video tutorial integration
- 🔄 Advanced analytics
- 🔄 Social features (forums, study groups)
- 🔄 Push notifications

### Phase 3 (Future)
- 📋 AI-powered study recommendations
- 📋 Live tutoring sessions
- 📋 Marketplace for study materials
- 📋 Integration with schools

## 📊 Analytics & Monitoring

The app includes comprehensive analytics:

- **User Engagement**: Session duration, feature usage
- **Learning Analytics**: Quiz performance, study patterns
- **Technical Metrics**: App performance, error tracking
- **Content Analytics**: Popular subjects, question difficulty

## 🎯 Target Audience

### Primary Users
- **O-Level Students** (Ages 14-16): Form 4-5 students
- **A-Level Students** (Ages 17-19): Lower/Upper Sixth students

### Secondary Users
- **Teachers**: Content creators and student mentors
- **Parents**: Progress monitoring and support
- **Schools**: Institutional adoption and integration

## 💰 Monetization Strategy

### Freemium Model
- **Free Tier**: Basic past papers, limited quizzes
- **Premium Tier**: Video explanations, advanced analytics, offline mode
- **Institutional**: School-wide licenses with admin features

### Revenue Streams
- Monthly/yearly subscriptions
- One-time premium upgrades
- Institutional licensing
- Optional advertising (non-intrusive)

---

**Made with ❤️ for Cameroon students**

*Empowering the next generation through accessible, quality education technology.*
