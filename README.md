# Rocket Academy Coding Bootcamp: Project 2: Full-Stack App (Firebase)

https://bc.rocketacademy.co/2-full-stack/2.p-full-stack-app-firebase

# Lingo app

This is a web app for learning Spanish with the help of several study tools, e.g. flashcards, translator and game-based quizzes.

The app is designated for Spanish learners of all ages who can already speak fluent English.

In this app, users can

1. Create, edit, and delete their own flashcard sets.
2. Utilize the translator feature to translate the newly added word when creating/editing a flashcard.
3. Check the pronunciation of the Spanish word in each flashcard.
4. Search for flashcard sets created by other users using keywords and make a copy of a set if found.
5. Review their previously created sets in study mode.
6. Test their knowledge through 2 types of quiz: multiple choice questions quiz or mix and match quiz.
7. View the report on their quiz results and learning progress upon completing a quiz.

## How to use the app

1. Prior to accessing the main features of the app, all users are required to create an account or log in.
2. Once logged in, users are redirected to their personalized homepage where they can view their own flashcard sets.
3. Users can easily add a new flashcard set by clicking the "Add deck" button.
4. When creating a new set, users must ensure that they fill out both fields of the card and save changes by clicking the ✅ icon. Empty or incomplete cards cannot be saved. Previously saved cards can be edited by clicking the edit icon or deleted by clicking the ❎ icon.
5. When adding or editing a card in the set, users have the option to utilize the translator feature. By entering a word in the top input field and clicking the "translate" button, the translation will appear in the bottom input field. In some cases, multiple translation options may be available, allowing users to select the most appropriate one for the context. If the translation is not accurate enough, it can be edited.
6. For each set created by the user, it is mandatory to provide a name for the set in the deck name input field.
7. After completing all the cards in the set and giving it a name, users need to click the "save deck" button to store the set.
8. On the homepage, users can click on any flashcard set to view all the cards this set contains. Additionally, a menu is available that offers three options: 1. Review cards in study mode, 2. Play a multiple-choice questions quiz, 3. Play a mix and match quiz.
9. In study mode, cards are automatically shuffled and displayed one by one. Users are presented with the English word and are required to recall its Spanish equivalent. If they forget or wish to verify their guess, they can flip the card by clicking on it or using the "show answer" button. The Spanish translation will then be revealed. If users are confident that they have memorized a word, they can click the "Good!" button below the card, and that specific card will no longer appear. Conversely, if they feel they haven't yet memorized the word, they can click "again" to ensure the card reappears.
10. Both in study mode and on the add/edit deck page, users can utilize the "play audio" button next to the Spanish word to listen to its proper pronunciation.
11. In the multiple-choice questions quiz, users are presented with an English word and four options for its Spanish translation. They must select the option they believe is the correct answer. They will receive immediate feedback on whether their answer was correct or not.
12. The mix and match quiz requires users to match English terms with their corresponding Spanish equivalents by dragging the Spanish word and dropping it next to its English translation.
13. After completing any of the quizzes, users will be shown their score.
14. On the homepage, users can find and click the "analytics" icon to access the quiz history report, which displays previously taken quiz results.
15. The homepage features a search bar tool where users can enter keywords such as "weather" or "shopping". If there are any sets created by other users that match the search request, they will be displayed to the current user. They can view the cards within the set and choose to copy it by clicking the "copy" button, if desired.

## Requirements

To install and launch the app, you will need NodeJS v16+

## How to install the app

In the project directory, you can run:

### `npm install`

## How to launch the app

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Built with

![Static Badge](https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=React&labelColor=black)

![Static Badge](https://img.shields.io/badge/Firebase-F6C746?style=for-the-badge&logo=Firebase&labelColor=black)

![Static Badge](https://img.shields.io/badge/OpenAI-66A270?style=for-the-badge&logo=OpenAI&logoColor=66A270&labelColor=black)

![Static Badge](https://img.shields.io/badge/Axios-FAFAF9?style=for-the-badge&logo=Axios&labelColor=black)

![Static Badge](https://img.shields.io/badge/Google%20cloud-FA6322?style=for-the-badge&logo=Google-cloud&logoColor=FA6322&labelColor=black)

![Static Badge](https://img.shields.io/badge/MUI-2061D2?style=for-the-badge&logo=MUI&labelColor=black)

![Static Badge](https://img.shields.io/badge/Bootstrap-6331AE?style=for-the-badge&logo=Bootstrap&labelColor=black)

![Static Badge](https://img.shields.io/badge/.env-4AE97A?style=for-the-badge&logo=dotenv&logoColor=4AE97A&labelColor=black)
