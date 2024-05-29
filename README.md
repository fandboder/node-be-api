# Node-BE-api

## Tech Stack
?

example:
- Node v20.x 
- Express 7.0.8
- Mysql 8.0.32
- Grape API

## Start
?

example:
1. Install Docker, Docker compose
2. copy .env.sample to .env and edit values variables
3. Start:

```
  docker compose build
  docker compose up
  docker compose exec app rails db:create
  docker compose exec app rails db:migrate
  docker compose exec app rails db:seed
```

4. Link: http://localhost:3000

5. link swagger: http://localhost:3000/swagger

6. Local mail link: http://localhost:3000/mailer

## Dummy data
?

example
1. Admin

- email: 
- password: 

2. User

- show_id: 
- password: 
