
# Pixfolio

An image gallery for photographers to upload pictures online and assign them to users. Users can login to review their images and assign tags for easy categorization and download.

![Screenshot 2023-07-15 at 10-36-51 Pixfolio App](https://github.com/dexterch91/project2-bootcamp/assets/38061057/6ed84631-2c91-4307-8f79-ec7cde6eccc3)

![Screenshot 2023-07-15 at 10-38-25 Pixfolio App](https://github.com/dexterch91/project2-bootcamp/assets/38061057/03d3ac42-ca78-4968-9cd1-01d1d396a7c0)

![Screenshot 2023-07-15 at 10-35-05 Pixfolio App](https://github.com/dexterch91/project2-bootcamp/assets/38061057/4ce71dcc-073d-4066-a029-ef7a802982cd)

# Features

Upload screen which allows the admin to upload multiples images and tag it to users.

Image gallery screen which allows the user to:
* Tag image with categories
* Filter images
* Download the images in zip file format

# Tech Used
Front end: [React](https://react.dev)

Routing: [React Router](https://reactrouter.com/en/main)

UI: [MUI](https://mui.com)

Storage/Database/Auth: [Firebase](https://firebase.google.com/docs)

File Upload: [Dropzone](https://www.dropzone.dev)

File Download: [file-saver](https://www.npmjs.com/package/file-saver), [jszip](https://stuk.github.io/jszip)

# Installation
This project was bootstrapped with Create React App. In the project directory, run the following steps:

1. Clone repo to local
2. Configure .env file and insert the API keys
```
REACT_APP_API_KEY = <API key>
REACT_APP_AUTH_DOMAIN = <API key>
REACT_APP_DATABASE_URL = <API key>
REACT_APP_PROJECT_ID = <API key>
REACT_APP_STORAGE_BUCKET = <API key>
REACT_APP_MESSAGING_SENDER_ID = <API key>
REACT_APP_APP_ID = <API key>
```

3. Install the dependencies



```
  npm install react
  npm install react-router-dom
  npm install react-dropzone
  npm install jszip
  npm install file-saver
  npm install @mui/material @emotion/react @emotion/styled
  npm install firebase

```
# Run the app in dev mode:
Open the terminal and render the app: 
```bash
npm start
```

To view it in the browser: http://localhost:3000

# Usage:
## Admin
1. Upload images and tag to the user (jpg or png format only).
2. Generate unique password for the user

## User
1. Once admin has uploaded the images, user can sign up with the unique password
2. User can login and see the images tagged to him
3. To categorize the image, double click on the image and enter the keywords
4. To remove the category, click 'X' on the image tooltip.
5. User may search all images to find images which fall under the respective categories. More than one category can be searched in one line, i.e. the search term 'sun mountain' will display images with 'sun' and/or 'mountain' tags.
6. User may download the images, which will be in stored in zip format.
7. User can logout once the process is completed.
