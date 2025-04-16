
## Description

Nestjs backend for Thingy music player.

## Project setup
1. download packages
```bash
$ npm install
```
2. create a .env based on the .env.example
3. create the database
```bash
$ npx prisma db push
```

## Compile and run the project

```bash
# development
$ npm run start:debug

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Endpoints

The full documentation of the endpoints can be viewed under /api after running the project

## Run tests

```bash
$ npm run test
```

## Test database

If you don't want to create users and add data for testing, you can find a dump in the repo <br>
All the test users use the same password **testpsw**

## database model diagram

[diagram](https://github.com/BroGamesJaj/BackThingy/wiki)

## Authors
* [Mészáros Botond](https://github.com/MBotond21)
* [Pásztor Botond](https://github.com/BroGamesJaj)
