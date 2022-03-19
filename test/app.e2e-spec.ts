import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { Test } from '@nestjs/testing';
import { PrismaService } from './../src/prisma/prisma.service';
import { AppModule } from './../src/app.module';
import { AuthDTO } from 'src/auth/dto';
import { CreateBookmarkDTO } from 'src/bookmark/dto/create-bookmark.dto';

describe('Test e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const dto: AuthDTO = {
    email: 'michael@kong.com',
    password: '1234',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(9999);

    pactum.request.setBaseUrl('http://localhost:9999');
    prisma = app.get(PrismaService);
    prisma.cleanDB();
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Sign up', () => {
      it('Should throw if no email provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('Should throw if no password provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .stores('userId', 'id')
          .expectStatus(400);
      });

      it('Should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('Should sign up', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Login', () => {
      it('Should throw if no email provided', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it('Should throw if no password provided', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });

      it('Should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });

      it('Should throw if wrong email and password combination provided', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({
            email: dto.email,
            password: `${dto.password}wrong`,
          })
          .expectStatus(403);
      });

      it('Should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('jwt', 'jwt');
      });
    });
  });
  describe('User', () => {
    it('Should get user profile', () => {
      return pactum
        .spec()
        .get('/users/profile')
        .withHeaders('Authorization', 'Bearer $S{jwt}')
        .expectStatus(200)
        .expectBodyContains(dto.email);
    });

    describe('Test edit user profile', () => {
      it('Should update user profile correctly', () => {
        const payload = {
          firstName: 'Michael',
        };
        return pactum
          .spec()
          .patch('/users/edit')
          .withHeaders('Authorization', 'Bearer $S{jwt}')
          .withBody(payload)
          .expectStatus(200)
          .expectBodyContains(payload.firstName);
      });
    });
  });

  describe('Bookmark', () => {
    const payload = {
      title: 'freecodecamp',
      description: 'my first bookmark',
      link: 'https://freecodecamp.org',
    };

    it('Should get empty bookmarks before create one', () => {
      return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders('Authorization', 'Bearer $S{jwt}')
        .expectStatus(200)
        .expectBody([]);
    });

    it('Should create bookmark', () => {
      return pactum
        .spec()
        .post('/bookmarks')
        .withBody(payload)
        .withHeaders('Authorization', 'Bearer $S{jwt}')
        .stores('bookmarkId', 'id')
        .expectStatus(201)
        .expectBodyContains(payload.title)
        .expectBodyContains(payload.link)
        .expectBodyContains(payload.description);
    });

    it('Test edit bookmark by id', () => {
      const payload = {
        description: 'updated bookmark',
      };
      return pactum
        .spec()
        .patch('/bookmarks/edit/$S{bookmarkId}')
        .withBody(payload)
        .withHeaders('Authorization', 'Bearer $S{jwt}')
        .expectStatus(200)
        .expectBodyContains(payload.description)
        .expectBodyContains('$S{bookmarkId}');
    });

    it('Test get bookmarks', () => {
      return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders('Authorization', 'Bearer $S{jwt}')
        .expectStatus(200)
        .expectJsonLength(1);
    });

    it('Test get bookmark by id', () => {
      return pactum
        .spec()
        .get('/bookmarks/$S{bookmarkId}')
        .withHeaders('Authorization', 'Bearer $S{jwt}')
        .expectStatus(200)
        .expectBodyContains(payload.title)
        .expectBodyContains(payload.link)
        .expectBodyContains('$S{bookmarkId}');
    });

    it('Test delete bookmark by id', () => {
      return pactum
        .spec()
        .delete('/bookmarks/$S{bookmarkId}')
        .withHeaders('Authorization', 'Bearer $S{jwt}')
        .expectStatus(204);
    });

    it('Should get empty bookmarks after delete', () => {
      return pactum
        .spec()
        .get('/bookmarks')
        .withHeaders('Authorization', 'Bearer $S{jwt}')
        .expectStatus(200)
        .expectBody([]);
    });
  });
});
