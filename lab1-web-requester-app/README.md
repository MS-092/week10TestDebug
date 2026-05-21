# Web Requester App

A simple yet powerful mobile application built with Expo and React Native that allows users to make HTTP GET requests and view responses directly from their mobile device.

## How to Use

1. **Launch the app** on your preferred platform (iOS, Android, or web)
2. **Enter a URL** in the text input field (e.g., `https://api.example.com/data`)
3. **Tap "Go Request"** to send the HTTP GET request
4. **View the response** in the Response section below
   - Success responses show the HTTP status code and response data
   - Error responses display the status code and error message
   - Network errors show detailed error information

## Implementation details

### Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Rapid app development platform
- **XMLHttpRequest**: For making HTTP requests
- **React Hooks**: For state management (useState)

### Component Structure

The main app file (`app/(tabs)/index.tsx`) contains:

- URL input field with placeholder guidance
- "Go Request" button to trigger requests
- Real-time response display with scrollable results
- Loading state management and user feedback

## File-Project structure

```text
web-requester-app/
├── app/
│   ├── _layout.tsx
│   ├── modal.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── explore.tsx
│       └── index.tsx (Main Web Requester)
├── components/
├── constants/
├── hooks/
└── package.json
```
