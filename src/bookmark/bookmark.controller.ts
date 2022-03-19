import {
  Body,
  Controller,
  Patch,
  Post,
  Get,
  UseGuards,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { User as UserDecorator } from '../auth/decorator/user.decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDTO } from './dto/create-bookmark.dto';
import { EditBookmarkDTO } from './dto/edit-bookmark.dto';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  createBookmark(
    @Body() dto: CreateBookmarkDTO,
    @UserDecorator('id') userId: number,
  ) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Get()
  getBookmarks(@UserDecorator('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @UserDecorator('id') userId: number,
  ) {
    return this.bookmarkService.getBookmarkById(bookmarkId, userId);
  }

  @Patch('edit/:id')
  editBookmarkById(
    @Body() dto: EditBookmarkDTO,
    @Param('id', ParseIntPipe) bookmarkId: number,
    @UserDecorator('id') userId: number,
  ) {
    return this.bookmarkService.editBookmarkById(dto, userId, bookmarkId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @Param('id', ParseIntPipe) bookmarkId: number,
    @UserDecorator('id') userId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(bookmarkId, userId);
  }
}
