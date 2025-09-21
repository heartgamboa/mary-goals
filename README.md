# DanceFit Portfolio

A React Native app built with Expo Go that provides a centralized platform for students to showcase their talent in dance and fitness through personal performance portfolios. The app allows teachers to monitor physical development, creativity, and participation while promoting interaction through voting and feedback features.

## Features

### 🎭 Performance Portfolios
- Create personalized fitness portfolios to showcase dance routines and exercise progress
- Upload videos with titles, descriptions, categories, and skill levels
- Support for multiple performance categories (Dance, Fitness, Gymnastics, Martial Arts, Yoga)

### 👥 User Roles & Management
- **Students**: Upload performances, view leaderboards, track progress
- **Teachers**: Monitor student activity, view analytics, provide feedback
- **Admins**: Full system access and management

### 🗳️ Interactive Voting System
- Vote on performances with different reaction types (Like, Love, Amazing)
- 5-star rating system for detailed feedback
- Comment system for constructive feedback
- Real-time vote statistics and rankings

### 🏆 Leaderboard & Recognition
- Dynamic leaderboard with multiple categories and timeframes
- Badge system for achievements and milestones
- Points system based on performance quality and engagement
- Recognition for top performers

### 📊 Progress Tracking
- Visual progress reports for teachers
- Performance analytics and participation trends
- Skill level progression tracking
- School and grade-based organization

## Tech Stack

- **React Native** with Expo Go
- **Firebase** (Authentication, Firestore, Storage)
- **expo-av** for video playback
- **expo-image-picker** for video selection
- **@react-native-picker/picker** for form inputs

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Firebase project setup
- Expo Go app on your mobile device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dancefit-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update `firebaseConfig.js` with your Firebase credentials

4. Start the development server:
```bash
npm start
```

5. Scan the QR code with Expo Go app on your mobile device

## Project Structure

```
dancefit-portfolio/
├── app/
│   ├── auth/
│   │   ├── login.jsx
│   │   └── signup.jsx
│   ├── index.jsx (Home/Feed)
│   ├── upload.jsx
│   ├── leaderboard.jsx
│   ├── profile.jsx
│   └── _layout.jsx
├── components/
│   ├── VideoCard.jsx
│   └── BottomTabNavigator.jsx
├── context/
│   └── AuthContext.jsx
├── services/
│   ├── videoService.js
│   └── votingService.js
├── firebaseConfig.js
└── package.json
```

## Key Features Implementation

### Authentication
- Firebase Authentication with email/password
- User profile management with roles
- School and grade information for students

### Video Management
- Video upload to Firebase Storage
- Metadata storage in Firestore
- Real-time updates using Firestore listeners
- CRUD operations for video posts

### Voting System
- Multiple vote types (Like, Love, Amazing)
- Star rating system (1-5 stars)
- Comment functionality
- Real-time vote statistics

### Leaderboard
- Points-based ranking system
- Category and timeframe filters
- Badge achievements
- User statistics display

## Firebase Collections

### users
- User profiles with role, school, grade, skill level
- Points, badges, and performance statistics

### videos
- Video metadata (title, description, category, skill level)
- User information and timestamps
- Vote counts and ratings

### votes
- Individual votes with ratings and comments
- Performance and user references
- Timestamps for tracking

## Usage

### For Students
1. Sign up with student role and school information
2. Upload performance videos with categories and skill levels
3. View and vote on other students' performances
4. Track progress on leaderboard
5. Earn badges for achievements

### For Teachers
1. Sign up with teacher role
2. Monitor student performances and progress
3. View analytics and participation trends
4. Provide feedback through voting system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.