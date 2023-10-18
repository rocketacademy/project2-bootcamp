# Rocket Academy Project 2: Full-Stack Application (Firebase)

Contributors: Ignatius Tan, Gabriel Lim, Kenneth Lee

# Paired Up - Couples App

[To update] App description in one sentence

## Tech Stack [To update]

- React.JS
- TailwindCSS
- Daisy UI
- Google Calendar API
- React Router
- Framer Motion

## Project Management

- Kanban Board - Notion
- Wireframing & User Flows - Miro
- Communication - Slack
- Designing - (iggy to add) Illustrator

## Core Features [To update]

- Dates - [To update] Plan dates together in advance & add to your calendar instantly
- Chat - [To update] Private chatroom with your significant other! Share your favourite memories together
- Feed - [To update] All in one
- Bucket List - [To update]
- Time Capsule - [To update]
- Journal - [To update]

## Demo - Gabriel

- Sign up Flow User 1
  - Create new user Ellie Fredricksen + Display photo
  - Show invalid email checks
  - Email ellie.fredricksen@pixar.com Pass adventure
  - Show invalid pairkey - adventure is used (Adventure is out there!)
  - PairKey - adventurebook
- Sign up Flow User 2
  - Create new user Carl Fredricksen + Display photo (Mispell name to change later)
  - Email carl.fredricksen@pixar.com Pass paradisefalls
  - Copy and paste pairKey
  - Join Pairkey
- Homepage Overview
  - Short overview of the apps
  - Upcoming date
- Settings page - User 2
  - Change background photo to customise
  - Change display picture and name (Correct name and pick a nicer picture for Carl)
  - Change start of relationship (7 Aug 2009 - Up realease date)
  - Show delete pair option

## Demo - Iggy

(Login as user 2 - Email carl.fredricksen@pixar.com Pass paradisefalls)

- Bucket List
- Dates
- Journal
-
- add to memories -> handover to kenneth

## Demo - Kenneth

- Memories
  -Create new picnic post with multiple images and tag picnic and dates
  -Scroll through the carousel
  -Comment on it
  -Edit the post to include one more pic and edit text(if edit function is ready)
  -Demo filter posts(filter by picnic first then by dates, then clear filter)
  -Delete post
- Chat
  -G and I to talk in chat while I'm talking about it
  -Demo the image upload system(upload 1 file only)
  -Generate chat prompt
- signout -> show that users cannot access when signed out

Challenges Faced

Modal 
-Modals are present even when not displayed - their properties can be changed
-Bugs from Referencing modals by ID - single most time consuming source of bugs
-document.getElementById
-label htmlFor 
-Unique element IDs are important!!
-5 composers overlaid so it looks like 1 - edit top one only - all data going to right place but editing wrong modal

Standardized components
-Text boxes with rounded edges? 
-Align center or align left? 
-Navbar on every page? How tall? 
-Dealing with absolute positioned components can be troublesome
-Retro-synchronization could be avoided

Git
-Work out of own branch, push to dev branch
-What if dev was updated since my last pull? Eg day 1 iggy and I git pull origin dev, day 2 iggy submits PR to dev, day 3 what do I do if i want to submit PR without reverting Iggy’s work?
-Accidental git push - disabled direct pushing to main and dev without PR
-PR reviews by both other team members
-For the most part 1 person per feature at any 1 time

Data structures
-Synchronisation of organisation across database and storage
-Data - room or user specific? Who can edit? How to link user and room?
-room/user/data or user/room/data?
->user/userdata and room/roomdata, link by room/username
-which values must be unique? (eg users can choose non unique display name but identifiers can break when they change it or we have both users in the same room with same display name)
-Auth doesn’t store room data or even a room name - we need to match user data from Auth to room data from Database

Creating rooms
-Signup - How do we ensure we don’t have random people joining rooms not intended for them?
-How do we ensure only the intended 2nd user joins the 1st user’s room?

