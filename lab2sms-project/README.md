# CYBER SMS - Expo SMS Application

A modern, neon-themed SMS application built with Expo and React Native. It features multi-contact selection, persistent custom contacts, real-time contact suggestions, and a responsive design for a seamless experience on both mobile and web platforms.

![Expo](https://img.shields.io/badge/Expo-54-black?style=flat-square&logo=expo)
![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)

## Key Features

- **SMS Composition & Sending**: Compose SMS messages that are opened in the device's default messaging app.
- **Device & Custom Contacts**:
    - Access and search the device's contact list.
    - Manually add custom contacts with a name and phone number.
    - Custom contacts are **securely persisted** on the device and are available across app sessions.
- **Multi-Contact Selection**:
    - Select one or more contacts to send a message to multiple recipients.
    - "Select All" and "Clear Selection" buttons for efficiency.
- **Real-Time Contact Suggestions**:
    - The phone number input on the home screen provides live suggestions from the contact list as you type.
- **Centralized State Management**:
    - Uses React Context (`ContactsContext`) to provide a single source of truth for contact data, ensuring state is perfectly synced across all screens.
- **Modern, Responsive UI**:
    - A sleek, neon-themed dark mode interface.
    - Adaptive layouts for different screen sizes, including multi-column grids on tablets.
- **Permissions Handling**: Graceful permission requests and UI feedback for access to device contacts.

---

## Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- Expo Go app on your iOS or Android device

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd lab2sms
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npx expo start
    ```
    This will start the Metro bundler and display a QR code in the terminal.

4.  **Open the app:**
    -   Scan the QR code with the Expo Go app on your Android or iOS device.
    -   Alternatively, press `a` to open in an Android emulator or `i` to open in an iOS simulator if you have them configured.

### Troubleshooting

-   **"Failed to download remote update" Error:** If you encounter this, the Metro bundler's cache may be corrupt. Stop the server (`Ctrl+C`) and restart it with the `--clear` flag:
    ```bash
    npx expo start -c
    ```
-   **Connection Issues:** Ensure your development machine and your mobile device are on the **same Wi-Fi network**. If LAN connection fails, press `s` in the terminal after starting to switch to a "Tunnel" connection.

---

## Project Architecture

### State Management: `ContactsContext`
To ensure all parts of the app have access to the same, up-to-date contact list, this project uses a shared React Context.

-   **`contexts/contacts-context.tsx`**: Defines the `ContactsProvider` and a `useContactsContext` hook. The provider wraps the entire application.
-   **`hooks/use-contacts.ts`**: This hook contains all the logic for fetching device contacts and fetching/saving custom contacts via `expo-secure-store`. It is called once within the `ContactsProvider`.
-   **Consumers**: The `ContactsScreen` and `HomeScreen` both call `useContactsContext()` to access and manipulate the shared contact data, ensuring perfect synchronization.

### Core Technologies

-   **Framework**: Expo SDK 54
-   **Language**: TypeScript
-   **Navigation**: Expo Router (file-based)
-   **Persistent Storage**: `expo-secure-store` for saving custom contacts securely on the device.
-   **Native APIs**: `expo-contacts`, `expo-sms`

---

## Important Note on SMS Functionality

As per official Android and iOS platform policies, third-party applications are not permitted to send SMS messages directly in the background without user intervention. This is a critical security measure to prevent malicious apps from sending messages without consent.

This application uses `expo-sms`, which follows these guidelines. The library prepares the SMS with the recipient(s) and message body, and then opens the device's **default messaging app** for the user to press "Send." This is the standard, secure, and accepted behavior.
