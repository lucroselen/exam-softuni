# Description

### SoftUni exam on nodeJs, express, express-handlebars and mongoDb

This is a SoftUni MPA exam project.

It is meant to be run locally, so for that matter MongoDB server is required to be installed and running as a service on the machine.

## Prerequisites

Before you start the project, please run the following commands in the terminal:

npm i

or manually:

npm install bcrypt cookie-parser express express-handlebars jsonwebtoken mongoose
npm install nodemon --save-dev

## How to start the project

In the terminal, run the following command:

npm start

!! It will not start if MongoDB server is not installed and running as a service on the PC !!

## Notice

This project has NO test data ready. The user should first register and create test data using the built "create post" functionality.
To see the different views/functionalities on the 'details' page (e.g. owner of posts can edit/delete; non-owner can like/dislike), please switch users.
