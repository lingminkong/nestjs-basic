# Notes

## Dependency Injection

Nest provides shortcut to handle dependencies 👇‍

```
export class AuthController {
  constructor(private authService: AuthService) {}
}
```

is equals to

```
export class AuthController {
  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
}
```

## Controller & Services (Providers)

It is common that a controller has the same function structure as corresponding service.

## Run a Prisma migration

1. update the prisma schema in `prisma/schema.prisma`
2. run `npx prisma migrate dev` to do a migration. This will generate a new migration file with provided migration name

## Commands

### open a web database interface

```
npx prisma studio
```

### install nest build-in class validator

```
npm i --save class-validator class-transformer
```

## Good to know

By default, NestJs returns 201 http status code with any Post request. Normally 201 status code means that new entry/data has been created in backend. We can use built-in decorate `@HttpCode()` to modify returned status code.

NestJs has a built-in enum `HttpStatus` with various status code to be used.

- handle edit bookmark request dto => id should in params
- expect body type array => can check on array length, expectJsonLength(1);
- parse id string in params => user ParseIntPipe @Param('id', ParseIntPipe) bookmarkId: number
- empty subroute handling => @Get()
- parameter route handling => @Get(':id')
