# Yoga Vibe 

Yoga Vibe is a mobile application built with React Native and Expo, designed to help users practice yoga at home in a simple and structured way.

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
            |           (title: "Редактирай профил")
            |
            \-- AuthTab
                |
                |-- ако потребителят Е логнат:
                |   |
                |   \-- ProfileScreen (директно, без stack)
                |
                \-- ако потребителят НЕ е логнат:
                    |
                    \-- AuthStackNavigator
                        |
                        |-- LoginMain (LoginScreen)
                        |   (title: "Вход")
                        |
                        \-- Register (RegisterScreen)
                            (title: "Регистрация")

The app provides access to yoga categories, courses, and individual poses, including detailed descriptions, benefits, and visual guidance. The application is fully usable without user registration, allowing guest users to explore all available content.

Authenticated users gain additional functionality, such as the ability to mark completed yoga poses and track their personal progress. User progress is securely stored in Firebase and associated with each individual account.

## Key Features
- Browse yoga categories and courses
- View detailed information for each yoga pose
- Practice yoga without mandatory registration
- User authentication with Firebase
- Progress tracking for logged-in users
- Clean and intuitive mobile UI

## Technologies Used
- React Native
- Expo
- JavaScript
- React Navigation
- Firebase Authentication
- Firebase Firestore

This project is developed as part of a SoftUni React Native course , maden for Veselina Markova yoga teacher and follows modern best practices for mobile application architecture, navigation, and state management.

## https://yoga-vibe-4bdc3.web.app/