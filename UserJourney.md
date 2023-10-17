**All features for Paired Up**

# Planning

- Brainstorm ideas, features & draft wireframes in Miro
- Build Kanban board in Notion
- Set up Slack channel for project discussions
- Set up slides for final project presentation

# Setup

- Set up Create-react-app (TailwindCSS, Prettier-tailwindCSS, DaisyUI, React Router)
- Add Github Collaborators & Setup Rules (Reviwers + Push limits)
- Set up Firebase Storage, Real-time database, Authentication and add collaborators
- Set up .env & add gitignore!! in local respositary
- Set up Netlify - add api keys, deploy rules and test deploy

# Home Page

- **Auth** - Users can only access the home page when logged in
- (WIP) Users can view the next upcoming date on the top of the screen / displays no upcoming dates if empty
- Users can view the total number of days they have been together
- (WIP) Users can see the display names of themselves and their partner on the homescreen
- (WIP) Users can see the display pictures of themselves and their partner on the homescreen

# Settings Page

- **Auth** - Users can only access the home page when logged in
- (WIP) User can update their display photo
- (WIP) User can update their display name
- (WIP) User can replace their background photo (To test for landscape, portrait photos)
- User can update their start of relationship
- (Deprioritised) User can link their their google cal
- User can sign out of their account

# Onboarding - Landing Page

- User is given a brief overview of the features of Paired Up
- User can select sign in as an existing user
- User can select sign up as an new user
- User can view the app without having to login

# Onboarding - Sign Up

- User can upload their display photo when signing up
- User can input their display name when signing up
- (Make photo upload more obvious) User can only proceed to sign up with email/password when display name is filled (profile picture optional)
- User can view their display photo and display name when signing up
- User can receive feedback message (e.g. invalid email, account exists etc.) during the signup process

# Onboarding - Pairing

- Creating - Users can only create unique pair keys
- Creating - Users should be informed if their pair key is duplicated
- Creating - Users can only input dates before today
- Creating - Users in the waiting room are able to copy their pair key to send to their partner
- Creating - Users must input a unique pair key + their start of relationship to create a room
- Joining - Users should only be able to join a room if the pairkey has been created
- Joining - Users should NOT be able to join a room if there are already 2 members
- Both - Users should be redirected to the home page once isPairedUp && isLoggedIn is true

# Onboarding - Sign In

- (Deprioritised) User can view their display photo and display name after email has been input
- User can reset their password with forgot password
- User can receive feedback message (e.g. invalid email, account exists etc.) during the signin process

# Chat

# Dates

- Created date list
- User can create a date with modal
- User can delete cancelled dates
- Dates that are over will go to archive
- Dates created are sorted with the next one at the top

# Feed

- Users can filter posts by default tags (dates & milestones)
- Users can create new posts with a description, multiple tags and multiple images
- Users need to input a default tag (dates or milestones) when creating a post
- Users can search for custom tags to filter posts

# Bucket List

- Created bucket list
- User can create a bucketlist with modal
- User can check off items once done
- (WIP) use composer from Kenneth to send bucket list to feed
