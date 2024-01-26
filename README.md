# Airbnb Clone Project – Node37 Final Project (Backend)

This project serves as the backend for our Airbnb clone, a popular online marketplace for lodging, primarily homestays for vacation rentals, and tourism activities. The aim is to provide essential functionalities and features required for the Airbnb platform.

## Features

- User authentication using JWT (JSON Web Tokens)
- User, location, room, comment and booking management (Create, Read, Update, Delete)
- Uploading images using Multer
- API documentation using Swagger
- Testing API endpoints with Postman
- Database storage and retrieval using MySQL
- Containerization with Docker

## Technologies and Tools used

- Included in the learning curriculum:

  - NestJS
  - JWT (JSON Web Tokens)
  - Multer
  - Swagger
  - Postman
  - Docker
  - MySQL
  - Yarn package manager

- In the future, the team plans to explore and integrate additional technologies such as SocketIO to enhance the backend functionality.

## Installation

1. Clone the repository: `git clone https://github.com/vohaiphuc/cybersoft-be-airbnb.git`
2. Navigate to the project directory: `cd cybersoft-be-airbnb`
3. Install dependencies: `yarn install`
4. Run the `database/airbnb.sql` file for MySQL (this project uses the database-first approach)
5. Run `yarn prisma generate`
6. Run the application using the command: `yarn start` or `yarn start:dev`

## Configuration

1. Make sure you have `.env` file in the root directory.
2. Edit the environment variables as follows (you can skip this step if the .env file already contains accurate content):

   ```env
   DATABASE_URL="mysql://root:1234@localhost:3306/airbnb"
   TOKEN_KEY=CYBERSOFT_AIRBNB
   ```

## Useful Links

🌟 Youtube video: [Link to Youtube video](https://www.youtube.com/watch?v=Q1iGCRiA8wU&ab_channel=Vo%CC%83H%E1%BA%A3iPh%C3%BAc)

🌟 Postman collection: [Link to Postman Collection](https://raw.githubusercontent.com/vohaiphuc/cybersoft-be-airbnb/main/AirBnb.postman_collection.json)

##

This project is developed and contributed by [Phúc Võ](https://github.com/vohaiphuc), [Thảo Huỳnh](https://github.com/ThaoHuynhD) and [Long Phan](https://github.com/longphanquangminh).
