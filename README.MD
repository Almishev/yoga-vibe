# Yoga Vibe 

Yoga Vibe is a mobile application built with React Native, Expo, FireBase , designed to help users practice yoga at home in a simple and structured way.

```text
App
|
\-- NavigationContainer
    |
    \-- RootNavigator (Stack)
        |
        \-- TabNavigator (Bottom Tabs)
            |
            |-- HomeTab
            |   |
            |   \-- HomeStackNavigator
            |       |
            |       |-- Home (HomeScreen)
            |       |
            |       |-- Courses (CoursesScreen)
            |       |
            |       |-- CourseDetails (CourseDetailsScreen)
            |       |   (title: course.title)
            |       |
            |       \-- AsanaDetails (AsanaDetailsScreen)
            |           (title: asana.name)
            |
            |-- AboutTab
            |   |
            |   \-- AboutScreen
            |
            |-- ProfileTab
            |   |
            |   \-- ProfileStackNavigator
            |       |
            |       |-- Profile (ProfileScreen)
            |       |
            |       \-- EditProfile (EditProfileScreen)
            |           (title: "Edit Profile")
            |
            \-- AuthTab
                |
                |-- if the user is log in:
                |   |
                |   \-- ProfileScreen (директно, без stack)
                |
                \-- if the user is NOT log in:
                    |
                    \-- AuthStackNavigator
                        |
                        |-- LoginMain (LoginScreen)
                        |   (title: "Login")
                        |
                        \-- Register (RegisterScreen)
                            (title: "Register")
```

The app provides access to yoga courses, and individual poses, including detailed descriptions, benefits, and visual guidance. The application is fully usable without user registration, allowing guest users to explore all available content.

Authenticated users gain additional functionality, such as the ability to mark completed yoga poses and track their personal progress. User progress is securely stored in Firebase and associated with each individual account.

## Key Features
- Browse yoga courses
- View detailed information for each yoga pose
- Practice yoga without mandatory registration
- User authentication with Firebase
- Progress tracking for logged-in users
- Clean and intuitive mobile UI

## React Native App Functionality
- **Course & content browsing**: users can browse all available yoga courses and see the list of asanas for each course.
- **Asana details**: each pose has a dedicated screen with name, description, benefits, execution time and image.
- **Guest mode**: all content (courses and asanas) is available without registration.
- **User profile**: authenticated users have a profile screen with name, email and profile photo.
- **Profile editing**: users can update their name and profile photo from the Edit Profile screen.
- **Progress tracking**: logged‑in users can mark completed asanas and courses, and this progress is stored per user in Firestore.
- **Navigation**: structured navigation with bottom tabs (Home, About, Profile, Auth) and nested stack navigators for details screens.

## Native & Device Features
- **Push notifications (Expo Push)**: when an admin creates a new course in the web admin panel, the backend stores Expo push tokens in Firestore and sends push notifications to all registered devices via Expo Push API.
- **Background delivery**: push notifications are delivered even when the mobile app is closed, so users are notified about newly added courses.
- **Local in-app notifications**: the app can also show local notifications while it is running, for example when new courses are detected during a Firestore subscription.
- **ImagePicker (camera & gallery)**: users can set a profile picture using the device camera or by picking an image from the gallery, with cropping to a square avatar.
- **Image compression & upload**: selected images are compressed on-device, uploaded to Firebase Storage and the download URL is saved to Firestore and Firebase Auth.
- **Secure image deletion**: when a user changes or removes their profile photo, or when an asana image is replaced/deleted in the admin panel, the old image file is removed from Firebase Storage to avoid unused files.
- **Safe‑area and status bar handling**: the app uses `react-native-safe-area-context` and Expo StatusBar for a polished, device‑friendly layout on both Android and iOS.

## Technologies Used
- React Native
- Expo
- JavaScript
- React Navigation
- Firebase Authentication
- Firebase Firestore

This project is developed as part of a SoftUni React Native course , maden for Veselina Markova yoga teacher and follows modern best practices for mobile application architecture, navigation, and state management.


## Backend for this yoga app:  https://yoga-vibe-admin.web.app
web admin panel 
https://github.com/Almishev/yoga-app-admin