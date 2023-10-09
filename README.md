# rika-auth

This repository contains the authentication service for the Rika project. It utilizes JWT as the authentication solution and PostgreSQL as the database.

## Run the project

### Database

To begin, you will need a functional PostgreSQL database. If you do not have one, you can run it within a container:

```shell
docker run --rm \
			-v local_pgdata:/var/lib/postgresql/data \
			-p 5432:5432 \
			-d \
			--name rika-auth-db \
			-e POSTGRES_USER=postgres \
			-e POSTGRES_PASSWORD=123 \
			postgres
```

This command;

-   creates a container named `rika-auth-db`,
-   provides a volume for it at `/var/lib/docker/volumes`,
-   exposes its port 5432 to the port 5432 of the host machine,
-   sets the database username to `postgres` and the password to `123`

### Environment

Set environment variables before run or create a `.env` file that provides these variables:

```shell
AUTH_SECRET=<Secret key for generating JWT tokens (You can choose any value you prefer)>
DATABASE_URL=<Database connection url>
```

If you create the PostgreSQL container using the command above, you can set the `DATABASE_URL` just like this:

```shell
DATABASE_URL="postgresql://postgres:123@localhost:5432/rika-auth?schema=public"
```

> The format of the connection URL typically follows this pattern:
>
> ```
> postgresql://<DB USERNAME>:<DB PASSWORD>@<DB HOST NAME OR IP ADDRESS>:5432/rika-auth?>schema=public
> ```

### Proto generation

After setting the environment variables and having a functional PostgreSQL database you'll need to generate TypeScript code from proto files. You can generate them by using Makefile:

```shell
make proto
```

> Please make sure that you have initialized the submodules before running this command.

Then you can run the auth service by typing:

```shell
yarn start:dev
```

## Build container image

If you want to run auth service in a docker container, you can do it. To create a docker image, just type:

```shell
make image
```

This command will create a docker image named `rika-auth-<version>`. The version specified in the `package.json` file will be `<version>`.
