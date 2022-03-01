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

## Commands

### open a web database interface

```
npx prisma studio
```

### install nest build-in class validator

```
npm i --save class-validator class-transformer
```
