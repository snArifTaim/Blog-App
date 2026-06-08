# Mini Blog Viewer

A React Native mobile application built with Expo, Apollo GraphQL, and Context API for theme management.

## Features

- ✅ **GraphQL Integration**: Fetch posts from a mocked GraphQL API using Apollo Client  
- ✅ **Infinite Scroll Pagination**: Load more posts as you scroll  
- ✅ **Favorites System**: Mark posts as favorites using Apollo Reactive Variables  
- ✅ **Theme Toggle**: Switch between light and dark modes using Context API  
- ✅ **Navigation**: Navigate between Post List, Post Details, and Favorites screens  
- ✅ **Loading & Error States**: Proper UI feedback for all states  
- ✅ **Pull-to-Refresh**: Refresh the post list by pulling down  
- ✅ **Like Mutation**: Simulate liking a post with GraphQL mutation  

## Tech Stack

- **React Native** with Expo
- **Apollo Client** for GraphQL state management
- **React Navigation** for screen navigation
- **Context API** for theme management
- **Reactive Variables** for local state (favorites)

## Project Structure

      MiniBlogViewer/
      ├── src/
      │   ├── apollo/
      │   │   ├── client.js          # Apollo Client setup with mock link
      │   │   └── queries.js         # GraphQL queries and mutations
      │   ├── components/
      │   │   └── PostCard.js        # Reusable post card component
      │   ├── context/
      │   │   └── ThemeContext.js    # Theme context provider
      │   ├── navigation/
      │   │   └── AppNavigator.js    # Navigation configuration
      │   └── screens/
      │       ├── PostList.js        # Main post list with pagination
      │       ├── PostDetails.js     # Single post details
      │       └── Favorites.js       # Favorite posts screen
      ├── App.js                     # Root component
      └── package.json

## Installation & Setup

1. **Clone this Repository**:
   
         https://github.com/snArifTaim/Blog-App.git
         cd MiniBlogViewer
2. **Install dependencies** (if not already installed):
   
       npm install

3. **Start the development server**:
   
       npx expo start --offline

4. **Run on your device**:
   - Scan the QR code with the Expo Go app (iOS/Android)
   - Or press `w` to run in web browser
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator (macOS only)
  
## How to Use

  ### Post List Screen
  - Scroll through the list of blog posts
  - Tap the **star icon** to add/remove posts from favorites
  - Tap the **moon/sun icon** to toggle between light and dark themes
  - Tap the **star icon** in the header to view your favorites
  - **Pull down** to refresh the list
  - **Scroll to the bottom** to load more posts

  ## 📸 Screenshots

| Home | Favorites |
|-------|----------|
| ![Home](./branding/screenshots/home.jpg) | ![Favorites](./branding/screenshots/favorites.jpg) |

| Post Details |
|---------------|
| ![Post Details](./branding/screenshots/post-details.jpg) |
  
  ### Post Details Screen
  - View the full content of a post
  - Tap the **Like Post** button to like the post (simulated mutation)
  - Tap the **back arrow** to return to the list
  
  ### Favorites Screen
  - View all posts you've marked as favorites
  - Tap any post to view its details
  - Favorites are stored in Apollo Reactive Variables (in-memory)

## Key Implementation Details

  ### Apollo Client
  - Custom **Mock Link** simulates a GraphQL server with 50 posts
  - **InMemoryCache** with pagination merge policy
  - **Reactive Variables** for favorites management
  
  ### Theme System
  - Light and Dark themes with carefully chosen color palettes
  - Context API provides theme to all components
  - Instant theme switching without re-renders
  
  ### Pagination
  - Uses Apollo's `fetchMore` for infinite scroll
  - Cache merge strategy appends new posts
  - Loading indicators for better UX

## Requirements Checklist

- ✅ Apollo Client setup with InMemoryCache
- ✅ Reactive variable for favorites
- ✅ ThemeContext for light/dark mode
- ✅ GraphQL queries (GetPosts, GetPost)
- ✅ GraphQL mutation (LikePost)
- ✅ Pagination with FlatList + onEndReached
- ✅ Cache merge function for pagination
- ✅ Error, Loading, and Empty states
- ✅ Combining Context + GraphQL in components
- ✅ Three screens (PostList, PostDetails, Favorites)
- ✅ Pull-to-refresh (Bonus)

## 👨‍💻 Author

### MD. Arif Islam
- 📱 Mobile App Developer (React Native & Expo)
- 🚀 Crafting modern, user-friendly & high-performance mobile apps fast!

 🔗 [GitHub](https://github.com/snArifTaim/) [LinkedIn](https://www.linkedin.com/in/sn-arif-dev/)

