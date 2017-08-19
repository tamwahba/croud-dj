# croud.dj
[![Build status](https://circleci.com/gh/tamwahba/croud-dj.png?circle-token=903864f03ea60ce93ae0ff497e0968eae0cd36dd&style=shield)](https://circleci.com/gh/tamwahba/croud-dj)

### Goal
Create a React + Redux responsive webapp. A secondary goal was to have the app be mostly
client side, with minimal server side processing.

### Screenshots
![Desktop screenshot](/screenshots/desktop-1.png?raw=true "Desktop screenshot 1")
![Mobile screenshot](/screenshots/mobile-1.png?raw=true "Mobile screenshot 1")

### Features
- Search, and play YouTube videos
- Host plays most popular song in queue
- Guests vote on queued songs
- Instant room updates

### Requirements
- [Firebase](https://firebase.google.com/) account with corresponding
environment variables (these are public, and served to the client):
    - `FIREBASE_API_KEY`
    - `FIREBASE_AUTH_DOMAIN`
    - `FIREBASE_DB_URL`

### To Run Local Instance
- `$ npm start`
- Navigate to localhost:3000 (assuming port 3000 is not in use)

### Dev Mode with Hot Reloading
- `$ npm run server:dev`
- Navigate to localhost:3000 (assuming port 3000 is not in use)
