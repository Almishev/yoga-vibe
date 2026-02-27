# Yoga Vibe

Yoga Vibe is a mobile application built with React Native, Expo and Firebase, designed to help users practice yoga at home in a simple and structured way.  
It is developed as part of a **SoftUni React Native course** for yoga teacher **Vasilena Markova** and follows modern best practices for mobile architecture, navigation and state management.  

> **Current status:** the app is being tested in a **closed beta group of 12 Android users** via an `.aab` build distributed through Expo / Google Play internal testing.

---

## Installation & Running Locally

- Node.js and `npm` installed
- Expo CLI (optional): `npm install -g expo-cli`

```bash
cd Yoga-Vibe
npm install
npx expo start
```

## Android Build (.aab)

Production build used for the closed beta group (Android only):

- `.aab` file: `https://expo.dev/artifacts/eas/dDihBtxWdfwYR3ZKCzLJep.aab`

## Admin Backend

The content (courses, asanas, images) is managed through a separate React Admin web panel:

- Web admin panel: `https://yoga-vibe-admin.web.app`  
- Source code: `https://github.com/Almishev/yoga-app-admin`

The admin backend uses Firebase (Firestore, Storage, Cloud Functions) to manage yoga content and send push notifications to the mobile app.

---

## Functional Guide

### 1. Project Overview

- **Application Name:** Yoga Vibe  
- **Application Category / Topic:** Fitness / Yoga / Wellness  

**Main Purpose:**  
Yoga Vibe helps users practice yoga at home in a calm and structured way. The app provides curated yoga courses and individual poses (asanas) with descriptions, benefits and execution time. Users can practice completely as guests, while authenticated users can track their personal progress through completed asanas and courses.

### 2. User Access & Permissions

#### Guest (Not Authenticated)

**Available screens and actions:**

- **Home tab**
  - Full‑screen hero image with the teacher and a “Get Started” CTA button that opens the list of courses.
- **Courses list**
  - Browse all available courses (title, category, duration, number of asanas).
  - Pull‑to‑refresh to reload data.
- **Course details**
  - See full course information: title, description, duration and list of asanas.
- **Asana details**
  - View pose image, description, benefits and execution time.
  - Use a practice timer (with vibration at the end of the countdown).
- **About tab**
  - Static information about the teacher and offered services.
- **Auth tab**
  - Access to **Login** and **Register** screens.

Guest users have access to all content (courses and asanas) but **do not** have a personal profile or persisted progress.

#### Authenticated User

**Main sections / tabs:**

- **HomeTab** – same content as for guests.
- **AboutTab** – teacher information and services.
- **ProfileTab**
  - Shows **ProfileScreen** with user data and progress (completed / started courses).
  - From here the user can open **EditProfileScreen** and log out.
- **AuthTab**
  - If the user is authenticated, the Auth tab redirects to the profile (via the auth/profile navigators).

**Details screens:**

- **CourseDetailsScreen**
  - Entered from the courses list.
  - Displays the list of asanas in a course and course metadata.
- **AsanaDetailsScreen**
  - Entered from the course details list.
  - Displays pose image, description, benefits, timer, and completion logic.

**Create / Edit / Delete actions (from the mobile app):**

- **Edit profile**
  - Update user name and profile photo (camera or gallery).
- **Progress tracking**
  - Mark asanas and courses as completed in Firestore.
- **Push tokens**
  - Register / update Expo push tokens per device and user.

> Creation and editing of courses and asanas is done only from the **web admin panel**, not from the mobile app.

### 3. Authentication & Session Handling

#### Authentication Flow

1. **App start**
   - `App.js` initializes Firebase and wraps the app in `AuthProvider` and `ThemeProvider`.
   - `AuthProvider` subscribes to `onAuthStateChanged` from Firebase Auth.
2. **Check authentication status**
   - When auth state changes, `AuthContext` receives either a full `user` object (uid, email, name, photoURL) or `null` (guest).
3. **Successful login / registration**
   - Login and Register screens call `loginUser` / `registerUser` from `authService`.
   - On success, Firebase returns a user; `AuthProvider` fetches additional user data from Firestore.
   - `AuthContext` is populated; Auth tab automatically switches to the profile flow.
   - A push token is registered for the logged‑in user.
4. **Logout**
   - `logoutUser` is called from the profile screen.
   - Firebase clears the session; `AuthProvider` sets `user = null`.
   - Auth tab shows Login/Register again.

#### Session Persistence

- **Storage:**  
  - Firebase Auth is configured with `getReactNativePersistence(AsyncStorage)` in `firebase.js`, so the session is stored in `AsyncStorage`.
- **Automatic login after restart:**  
  - On app start, `AuthProvider` listens to `onAuthStateChanged`.  
  - If a valid session exists in `AsyncStorage`, Firebase returns the existing user and the app logs in automatically without showing the login screen.

### 4. Navigation Structure

#### Root Navigation Logic

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
            |       |-- Courses (CoursesScreen)
            |       |-- CourseDetails (CourseDetailsScreen)
            |       \-- AsanaDetails (AsanaDetailsScreen)
            |
            |-- AboutTab
            |   \-- AboutScreen
            |
            |-- ProfileTab
            |   \-- ProfileStackNavigator
            |       |-- Profile (ProfileScreen)
            |       \-- EditProfile (EditProfileScreen)
            |
            \-- AuthTab
                |-- if user IS logged in  -> ProfileStackNavigator
                \-- if user is NOT logged in -> AuthStackNavigator
                        |-- LoginMain (LoginScreen)
                        \-- Register (RegisterScreen)
```

- Root navigation is a bottom tab navigator with **Home**, **About**, **Profile**, and **Auth** tabs.
- The Auth tab decides between **AuthStackNavigator** (Login/Register) and **ProfileStackNavigator** depending on `AuthContext.user`.

#### Nested Navigation

- **HomeStackNavigator**
  - `HomeScreen`
  - `CoursesScreen`
  - `CourseDetailsScreen`
  - `AsanaDetailsScreen`
- **ProfileStackNavigator**
  - `ProfileScreen`
  - `EditProfileScreen`
- **AuthStackNavigator**
  - `LoginScreen`
  - `RegisterScreen`

All stack navigators use native-stack (react-native-screens) with gesture‑based back navigation enabled (swipe‑back).

### 5. List → Details Flow

#### List / Overview Screens

- **CoursesScreen**
  - Displays all available yoga courses from Firestore:
    - title, category (yoga / cosmoenergetics), duration, number of asanas.
  - Supports pull‑to‑refresh and category filtering.

#### Details Screens

- **CourseDetailsScreen**
  - Triggered by tapping a course in `CoursesScreen`.
  - Receives the selected `course` via route params.
  - Fetches all asanas for this course (`getAsanasByCourseId`) and renders another list.
- **AsanaDetailsScreen**
  - Triggered by tapping an asana in `CourseDetailsScreen`.
  - Receives `asana` (and optionally `course`) via route params.
  - Shows image, description, benefits, execution time and a practice timer.

### 6. Data Source & Backend

**Backend Type:** Real backend – Firebase

- **Firebase Authentication** – registration/login/logout, user identity and profile data.
- **Firebase Firestore** – stores courses, asanas, user progress and push tokens.
- **Firebase Storage** – stores images (asana images, profile photos).
- **Firebase Cloud Functions + Expo Push API** – backend logic for sending push notifications when new courses are created in the admin panel.

The separate React Admin web app is responsible for creating and editing courses and asanas and for triggering Cloud Functions to send notifications.

### 7. Data Operations (CRUD)

#### Read (GET)

- `CoursesScreen` – fetches all courses from Firestore (`courseService.getAllCourses`).
- `CourseDetailsScreen` – fetches asanas by course id (`asanaService.getAsanasByCourseId`).
- `ProfileScreen` – fetches user progress (completed/started courses and asanas).
- `AsanaDetailsScreen` – receives full asana data via navigation and, when needed, reloads related course data.

#### Create (POST)

- **User Registration:**
  - Creates a new Firebase Auth user.
  - Creates a Firestore document with user name, email and photo URL.
- **Push tokens:**
  - `notificationService.registerPushToken` creates or updates documents in `pushTokens` collection per Expo push token.
- **User progress:**
  - When an asana is marked as completed for the first time, new progress documents are created in Firestore.

#### Update / Delete (Mutation)

- **Update**
  - Mark asanas and courses as completed for a user (progress documents).
  - Update user profile (name and photo) in Firestore and Firebase Auth.
  - Refresh push tokens on each login and on `initializeNotifications`.
- **Delete**
  - From the mobile app: image deletion is handled when a profile photo is replaced/removed – old files are deleted from Firebase Storage.
  - Course/asana creation and deletion is done via the admin backend.

The UI updates via React state and context; after each successful mutation the relevant screens re-render with the new data.

### 8. Forms & Validation

#### Forms Used

1. **Login form**
   - Fields: `email`, `password`.
2. **Register form**
   - Fields: `name`, `email`, `password`.
3. **Edit Profile form**
   - Fields: `name`, optional `profile photo` (camera/gallery).

#### Validation Rules

1. **Login – Email**
   - Must not be empty.
   - If the email is invalid or user does not exist, Firebase returns an error which is shown in an `Alert`.
2. **Register – Password**
   - Must not be empty.
   - Must satisfy Firebase’s minimum password length (otherwise Firebase returns an error which is displayed to the user).
3. **Edit Profile – Name (multiple rules)**
   - Must not be empty (`name.trim()` checked before submit).
   - Trimmed before being saved.
   - “Save” button is disabled while the name is empty.

### 9. Native Device Features

#### Used Native Feature(s)

- **Push Notifications (Expo Notifications)**
  - Registers Expo push tokens on device.
  - Receives remote push notifications even when the app is in the background or closed.
- **Camera / Image Picker (expo-image-picker)**
  - Allows users to set or change their profile picture from camera or gallery.
  - Cropping to a square avatar (aspect `[1,1]`) and on‑device compression.
- **Vibration**
  - Uses `Vibration` from React Native when the asana timer completes to give haptic feedback.

#### Usage Description

- `EditProfile` – requests camera/gallery permissions, lets the user pick or capture an image, compresses it and sends it to Firebase Storage; the download URL is stored in Firestore/Auth.
- `AsanaTimer` – vibrates the device when the timer reaches zero and shows a completion badge.
- `notificationService` – registers push tokens with Expo and stores them in Firestore so that Firebase Cloud Functions can send push notifications via Expo Push API.

### 10. Typical User Flow

1. The user opens the app and lands on **HomeScreen** with a large hero image and a “Get Started” button.
2. Tapping **Get Started** navigates to **CoursesScreen**, where the user selects a course and opens **CourseDetailsScreen**.
3. From the list of asanas the user opens an **AsanaDetailsScreen**, starts the timer and performs the practice; on completion the device vibrates.
4. If the user wants progress tracking, they go to **Auth tab**, register or log in, and then see their profile and progress in **Profile**.
5. When a new course is added by the teacher in the admin panel, Firebase Cloud Functions send a **push notification** to all registered devices; the user taps it and is taken back into the app to explore the new content.

### 11. Error & Edge Case Handling

- **Authentication errors**
  - Login and Register screens show `Alert` dialogs with Firebase error messages (invalid email, wrong password, user already exists, etc.).
- **Network or data errors**
  - When Firestore requests fail (courses/asanas/progress), errors are logged in the console and the user sees an `EmptyState` component with an icon and an error message.
- **Empty or missing data**
  - If there are no available courses or asanas, the app displays friendly empty states (e.g. “No courses available yet”).  
  - In profile, if there are no completed courses yet, an info section explains that the user will see completed courses once they start practicing.

---

## Technologies Used

- React Native & Expo
- JavaScript
- React Navigation (bottom tabs + native stack)
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Expo Notifications
- React Native Gesture Handler (swipe‑back, pinch‑to‑zoom)
