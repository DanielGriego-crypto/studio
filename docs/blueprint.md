# **App Name**: CaissaTON

## Core Features:

- Telegram Login: Authenticate users using Telegram ID via Firebase Auth.
- Real-time Chess Gameplay: Synchronize chess moves between players in real-time using Realtime Database for PvP matches.
- Earn CAI Tokens: Reward players with CAI tokens for winning games, completing tasks, and referring friends; track balances and transactions in Firestore.
- Divisional Ranking: Categorize players into divisions based on their CAI balance, using data stored and updated in Firestore.
- Matchmaking System: Pair players with opponents of similar skill level and division using Firestore queries and ELO-based matching.
- Customizable 3D Chess UI: Allow players to customize the appearance of their chess board and pieces with skins purchased using CAI tokens; store skin data in Firebase Storage.
- Referral System: Award referral bonuses (50 $CAI) via Cloud Functions; track who was referred by whom in Firestore

## Style Guidelines:

- Primary color: Gold (#FFD700) to represent the premium and token-based nature of the game.
- Background color: Dark Black (#121212) to enhance the luxury feel and contrast with gold accents.
- Accent color: Light Gold (#EEE8AA) for interactive elements and highlights, complementing the main gold tone.
- Body and headline font: 'Space Grotesk' sans-serif for headlines and 'Inter' sans-serif for body text to create a contemporary, techy, scientific feel.
- Use 3D chess piece icons to represent divisions; animate the icons to add depth and engagement.
- Design the layout in a vertical 9:16 format, optimized for Telegram Mini Apps, with a focus on a clean and intuitive user interface.
- Implement subtle animations, such as token animations and pulsating buttons, to enhance the user experience.