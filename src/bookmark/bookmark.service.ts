import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDTO } from './dto/create-bookmark.dto';
import { EditBookmarkDTO } from './dto/edit-bookmark.dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmarkDTO) {
    return this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: { userId },
    });
  }

  async getBookmarkById(bookmarkId: number, userId: number) {
    const result = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    if (!result) {
      throw new ForbiddenException('Access denied');
    }

    return result;
  }

  async editBookmarkById(
    dto: EditBookmarkDTO,
    userId: number,
    bookmarkId: number,
  ) {
    const bookmark = await this.getBookmarkById(bookmarkId, userId);

    if (bookmark) {
      return this.prisma.bookmark.update({
        where: { id: bookmarkId },
        data: { ...dto },
      });
    }
  }

  async deleteBookmarkById(bookmarkId: number, userId: number) {
    const bookmark = await this.getBookmarkById(bookmarkId, userId);

    if (bookmark) {
      await this.prisma.bookmark.delete({
        where: { id: bookmarkId },
      });
    }
  }
}
