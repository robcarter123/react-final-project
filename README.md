# Santa's Little Helper Frontend Project

Link to hosted version:

Link to associated backend repository: https://github.com/2202Hannah/final-project-be-ebay
Link to machine learning modeel repository: https://github.com/teyahbd/py-keyword-api

## Table of Contents

1. Summary of the project
2. How to use the project

## A Summary of the Project

This project creates a server for React Native mobile app called Santa's Little Helper. This was a group project completed over 8 days as part of the Northcoders bootcamp.

This project was bootstrapped with [Create Expo App](https://reactnative.dev/docs/environment-setup).

I used React Native to build the frontend of the project. We used axios to make requests to the backend of the project.

## How to setup and use the project:

### To FORK and CLONE the repository:

```bash dark
git clone https://github.com/robcarter123/react-final-project
```

### To run locally:

```bash dark
npm start
```

### Dependencies:

node version 18.7.0 minimum

To check you have node installed run:

```bash dark
node --version
```

To install node:

- [node.js](https://nodejs.org/en/download/package-manager/)

## npm Packages

A number of npm packages have been installed to help build this React app. These include:

- [React](https://reactjs.org)
- [axios](https://www.npmjs.com/package/axios)

## Login Page

The first page allows the user to login to their account.

## Preferences Form

The next page asks who the user is shopping for and saves their name as a new recipient on the user profile. The user is then ask to pick preferred categories from a list to get started.

## Swipe Cards

The user is then shown Tinder inspired swipe cards with gift recommendations. Keyword based on what the user likes are stored and then sent to the machine learning model. The machine learning model that suggests new keywords based on the likes which are used in the next call to the eBay API.

## Final Page

Once complete, the user can view all items they liked on the final page.
