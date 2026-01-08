# FilmFlow

FilmFlow is a premium movie discovery and tracking application built with React Native and Expo. It allows users to explore a vast database of movies, manage their personal watchlist, watch trailers, and share reviews with a sleek, modern UI.

## 🚀 Features

- **User Authentication**: Secure login and registration (powered by DummyJSON and local storage).
- **Movie Discovery**: Search for movies using the TMDB (The Movie Database) API.
- **Dynamic Home Screen**: Featured hero section and horizontal "Trending Now" carousel.
- **Cinematic Details**: View high-resolution posters, movie overviews, and top cast members.
- **Multimedia Integration**: Watch official movie trailers directly in the app.
- **Personalized Watchlist**: Organize movies into 'Want to Watch', 'Watching', or 'Watched' categories.
- **Ratings & Reviews**: Rate movies (1-5 stars) and write personal thoughts.
- **Intelligent Recommendations**: Personalized movie suggestions based on your history and watchlist.
- **Modern UI/UX**: 
    - **Glassmorphism**: Elegant blurred effects for a premium feel.
    - **Skeleton Loaders**: Smooth pulsing placeholders for fast perceived loading.
    - **Subtle Haptics**: Tactical feedback for critical actions.
    - **Bubbly Design**: Soft, high-border-radius aesthetics.
- **Dark Mode Support**: Seamlessly toggle between light and dark themes.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Navigation**: [React Navigation](https://reactnavigation.org/)
- **Animation**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) & LayoutAnimation
- **Multimedia**: `react-native-youtube-iframe`
- **Forms & Validation**: [Formik](https://formik.org/) & [Yup](https://github.com/jquense/yup)
- **API Client**: [Axios](https://axios-http.com/)
- **Icons**: [Feather Icons](https://feathericons.com/) via `@expo/vector-icons`
- **APIs Used**:
    - [TMDB API](https://developer.themoviedb.org/docs) (Movie data, posters, credits, and trailers)
    - [DummyJSON](https://dummyjson.com/) (Mock authentication)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your physical device (iOS/Android) OR an emulator/simulator.

## ⚙️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd FilmFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **API Key Setup:**
   Open `src/services/api.js` and replace `YOUR_TMDB_API_KEY` with your official key from TMDB.

## 🏃 Running the Application

Start the Expo development server:

```bash
npm start
```

### Mobile Device
Scan the QR code displayed in the terminal using the **Expo Go** app (Android) or the **Camera** app (iOS).

## 📁 Project Structure

```text
FilmFlow/
├── assets/             # Images, icons, and splash screen
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── common/     # Generic components (Buttons, Skeletons, etc.)
│   │   └── specific/   # Feature-specific components (MediaCard, etc.)
│   ├── navigation/     # Navigation configuration (Stacks, Tabs)
│   ├── screens/        # Main application screens
│   │   ├── auth/       # Login, Register, Landing, Onboarding
│   │   ├── home/       # Home, Movie Details
│   │   ├── profile/    # Profile, Watchlist
│   │   └── recommendations/ # Personalized suggestions
│   ├── services/       # API services and business logic
│   ├── store/          # Redux store and slices (watchlist, history, reviews)
│   ├── theme/          # Color constants and Theme Context
│   └── utils/          # Helper functions and validation schemas
├── App.js              # Root component
└── app.json            # Expo configuration
```

## 🔑 Test Credentials

For testing the authentication flow without registering, you can use the credentials found in `TEST_CREDENTIALS.md`.

## 📄 License

This project is licensed under the MIT License.
