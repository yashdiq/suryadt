## Description

[Nest](https://github.com/nestjs/nest) Scheduler for birthday message with different timezones

## Project setup

1. Create `.env` in the root file. See `.env.example`.
2. Install packages:

```bash
$ yarn install
```

3. Run `npx prisma migrate dev --name init` for database migration

## Compile and run the project

```bash
# watch mode
$ yarn start:dev
```

## Run concurrent tests

```bash
$ cd test
$ chmod +x concurrent-request.sh
$ ./concurrent-request.sh
```

nb: you can create the number of concurrent tests by changing number `10` to any number

### Swagger Documentation

```
http://localhost:3000/api
```
