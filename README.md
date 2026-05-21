# Week 10 - Testing & Debugging Lab

React Native testing + debugging tools. 4 tasks covering Jest, React DevTools, Firebase Test Lab, and Reactotron.

---

## Task 1: Jest Unit Testing

Here we are using the week10jest folder porject

Setup:
- `__tests__/HomeScreen-test.tsx` — 3 tests: text render, style check, snapshot
- `npm run test` to run

## Task 2: React Native Testing (React DevTools)

Here we are using the lab1-web-requester folder project

Goal: Use React DevTools to inspect component hierarchy, hooks, state, and run profiling.

Setup:
```bash
npm install -g react-devtools
```

Running:
1. Terminal 1: `npx react-devtools`
2. Terminal 2: `npx expo start` (from `lab1-web-requester-app/`)
3. Press `j` in Expo terminal to open debugger
4. On device/simulator — change TextInput values, press buttons

What to do:
- Find `HomeScreen` in component tree
- Inspect hooks tab — watch `url`, `webData`, `isLoading` state change
- Start profiler (dot icon), interact with app, stop — analyze flamegraph
- Check styles panel for component styling

Completed, you can look at the image folder

## Task 3: Firebase Test Lab

Pre-compiled APK from Lab 2 (SMS app) uploaded to Firebase Test Lab for automated device testing.

Here I have done the following:
1. Compiled the Lab2sms-project into APK file
2. Upload to Firebase test lab
3. Automated testing using Pixel Phone
4. Completed, you can look at the app map in the image folder

## Task 4: Reactotron

Reactotron runtime debugger for logging, network inspection, and performance tracking.

Setup (done):
- `npm i --save-dev reactotron-react-native`
- `ReactotronConfig.js` at project root
- `require("../../ReactotronConfig")` in `app/(tabs)/index.tsx`

Running:
1. Open Reactotron desktop app
2. Terminal: `npx expo start` (from `lab1-web-requester-app/`)
3. Open app in Expo Go
4. Reactotron auto-connects
5. Press buttons / change text — watch logs, network requests, state changes in Reactotron

---