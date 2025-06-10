import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/comment.dto';
import { PostResponseDto, FeedResponseDto, LikeInfoDto } from './dto/post-response.dto';
import { CommentResponseDto } from './dto/comment.dto';
import { MESSAGES } from '../../common/constants/messages.constant';
import { In } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private async getPostWithLikes(post: Post, currentUserWallet?: string): Promise<PostResponseDto> {
    // Get likes with user information
    const likes = await this.likesRepository.find({
      where: { post_id: post.id },
      relations: ['user'],
    });

    // Get comments with user information
    const comments = await this.commentsRepository.find({
      where: { post_id: post.id },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });

    // Transform likes to LikeInfoDto format
    const likesInfo: LikeInfoDto[] = likes.map(like => ({
      wallet_address: like.wallet_address,
      username: like.user?.username,
      profile_pic_url: like.user?.profile_pic_url,
    }));

    // Transform comments to CommentResponseDto format
    const commentsInfo: CommentResponseDto[] = comments.map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      wallet_address: comment.wallet_address,
      content: comment.content,
      timestamp: comment.timestamp,
      username: comment.user?.username,
      profile_pic_url: comment.user?.profile_pic_url,
    }));

    // Create the response DTO with explicit property assignment
    return {
      id: post.id,
      wallet_address: post.wallet_address,
      content: post.content,
      timestamp: post.timestamp,
      username: post.user?.username,
      profile_pic_url: post.user?.profile_pic_url,
      likes_count: likes.length,
      likes: likesInfo,
      comments_count: comments.length,
      comments: commentsInfo,
      is_liked: currentUserWallet ? likes.some(like => 
        like.wallet_address.toLowerCase() === currentUserWallet.toLowerCase()
      ) : undefined,
    };
  }

  async getFeed(page: number = 1, limit: number = 10, currentUserWallet?: string): Promise<FeedResponseDto> {
    // Get posts with user information
    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ['user'],
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get all likes for these posts in a single query
    const postIds = posts.map(post => post.id);
    const likes = await this.likesRepository.find({
      where: { post_id: In(postIds) },
      relations: ['user'],
    });

    // Get all comments for these posts in a single query
    const comments = await this.commentsRepository.find({
      where: { post_id: In(postIds) },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });

    // Group likes by post_id
    const likesByPost = likes.reduce((acc, like) => {
      if (!acc[like.post_id]) {
        acc[like.post_id] = [];
      }
      acc[like.post_id].push(like);
      return acc;
    }, {} as Record<number, Like[]>);

    // Group comments by post_id
    const commentsByPost = comments.reduce((acc, comment) => {
      if (!acc[comment.post_id]) {
        acc[comment.post_id] = [];
      }
      acc[comment.post_id].push(comment);
      return acc;
    }, {} as Record<number, Comment[]>);

    // Format posts with their likes and comments
    const formattedPosts = posts.map(post => {
      const postLikes = likesByPost[post.id] || [];
      const postComments = commentsByPost[post.id] || [];

      const likesInfo: LikeInfoDto[] = postLikes.map(like => ({
        wallet_address: like.wallet_address,
        username: like.user?.username,
        profile_pic_url: like.user?.profile_pic_url,
      }));

      const commentsInfo: CommentResponseDto[] = postComments.map(comment => ({
        id: comment.id,
        post_id: comment.post_id,
        wallet_address: comment.wallet_address,
        content: comment.content,
        timestamp: comment.timestamp,
        username: comment.user?.username,
        profile_pic_url: comment.user?.profile_pic_url,
      }));

      return {
        id: post.id,
        wallet_address: post.wallet_address,
        content: post.content,
        timestamp: post.timestamp,
        username: post.user?.username,
        profile_pic_url: post.user?.profile_pic_url,
        likes_count: postLikes.length,
        likes: likesInfo,
        comments_count: postComments.length,
        comments: commentsInfo,
        is_liked: currentUserWallet ? postLikes.some(like => 
          like.wallet_address.toLowerCase() === currentUserWallet.toLowerCase()
        ) : undefined,
      };
    });

    return {
      posts: formattedPosts,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async createPost(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    try {
      const post = this.postsRepository.create({
        wallet_address: createPostDto.wallet_address.toLowerCase(),
        content: createPostDto.content,
      });

      const savedPost = await this.postsRepository.save(post);
      const postWithUser = await this.postsRepository.findOne({
        where: { id: savedPost.id },
        relations: ['user'],
      });

      if (!postWithUser) {
        throw new NotFoundException(MESSAGES.POST.ERROR.NOT_FOUND);
      }

      // Return formatted post with empty likes array since it's a new post
      return {
        id: postWithUser.id,
        wallet_address: postWithUser.wallet_address,
        content: postWithUser.content,
        timestamp: postWithUser.timestamp,
        username: postWithUser.user?.username,
        profile_pic_url: postWithUser.user?.profile_pic_url,
        likes_count: 0,
        likes: [],
        comments_count: 0,
        comments: [],
        is_liked: undefined,
      };
    } catch (error) {
      throw new BadRequestException(MESSAGES.POST.ERROR.CREATE_FAILED);
    }
  }

  async getPostDetails(postId: number, currentUserWallet?: string): Promise<PostResponseDto> {
    // Get post with user information
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(MESSAGES.POST.ERROR.NOT_FOUND);
    }

    // Get likes for this post
    const likes = await this.likesRepository.find({
      where: { post_id: postId },
      relations: ['user'],
    });

    // Get comments for this post
    const comments = await this.commentsRepository.find({
      where: { post_id: postId },
      relations: ['user'],
      order: { timestamp: 'DESC' },
    });

    // Format likes
    const likesInfo: LikeInfoDto[] = likes.map(like => ({
      wallet_address: like.wallet_address,
      username: like.user?.username,
      profile_pic_url: like.user?.profile_pic_url,
    }));

    // Format comments
    const commentsInfo: CommentResponseDto[] = comments.map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      wallet_address: comment.wallet_address,
      content: comment.content,
      timestamp: comment.timestamp,
      username: comment.user?.username,
      profile_pic_url: comment.user?.profile_pic_url,
    }));

    // Return formatted post with likes and comments
    return {
      id: post.id,
      wallet_address: post.wallet_address,
      content: post.content,
      timestamp: post.timestamp,
      username: post.user?.username,
      profile_pic_url: post.user?.profile_pic_url,
      likes_count: likes.length,
      likes: likesInfo,
      comments_count: comments.length,
      comments: commentsInfo,
      is_liked: currentUserWallet ? likes.some(like => 
        like.wallet_address.toLowerCase() === currentUserWallet.toLowerCase()
      ) : undefined,
    };
  }

  async addComment(postId: number, createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
    // Check if post exists
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(MESSAGES.POST.ERROR.NOT_FOUND);
    }

    // Check if user exists
    const user = await this.usersRepository.findOne({
      where: { wallet_address: createCommentDto.wallet_address.toLowerCase() },
    });

    if (!user) {
      throw new BadRequestException('User not found. Please register first.');
    }

    try {
      const comment = this.commentsRepository.create({
        post_id: postId,
        wallet_address: createCommentDto.wallet_address.toLowerCase(),
        content: createCommentDto.content,
      });

      const savedComment = await this.commentsRepository.save(comment);
      const commentWithUser = await this.commentsRepository.findOne({
        where: { id: savedComment.id },
        relations: ['user'],
      });

      if (!commentWithUser) {
        throw new NotFoundException('Comment not found after creation');
      }

      return {
        id: commentWithUser.id,
        post_id: commentWithUser.post_id,
        wallet_address: commentWithUser.wallet_address,
        content: commentWithUser.content,
        timestamp: commentWithUser.timestamp,
        username: commentWithUser.user?.username,
        profile_pic_url: commentWithUser.user?.profile_pic_url,
      };
    } catch (error) {
      throw new BadRequestException(MESSAGES.POST.ERROR.COMMENT_FAILED);
    }
  }

  async getComments(postId: number, page: number = 1, limit: number = 10): Promise<{ comments: CommentResponseDto[]; total: number; page: number; limit: number; total_pages: number }> {
    const [comments, total] = await this.commentsRepository.findAndCount({
      where: { post_id: postId },
      relations: ['user'],
      order: { timestamp: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedComments = comments.map(comment => ({
      ...comment,
      username: comment.user?.username,
      profile_pic_url: comment.user?.profile_pic_url,
    }));

    return {
      comments: formattedComments,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async deleteComment(commentId: number, walletAddress: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(MESSAGES.POST.ERROR.NOT_FOUND);
    }

    if (comment.wallet_address.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new BadRequestException(MESSAGES.POST.ERROR.UNAUTHORIZED);
    }

    try {
      await this.commentsRepository.remove(comment);
    } catch (error) {
      throw new BadRequestException(MESSAGES.POST.ERROR.DELETE_FAILED);
    }
  }

  async likePost(postId: number, walletAddress: string): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(MESSAGES.POST.ERROR.NOT_FOUND);
    }

    // Check if already liked
    const existingLike = await this.likesRepository.findOne({
      where: {
        post_id: postId,
        wallet_address: walletAddress.toLowerCase(),
      },
    });

    if (existingLike) {
      throw new BadRequestException(MESSAGES.POST.ERROR.ALREADY_LIKED);
    }

    try {
      const like = this.likesRepository.create({
        post_id: postId,
        wallet_address: walletAddress.toLowerCase(),
      });
      await this.likesRepository.save(like);
    } catch (error) {
      throw new BadRequestException(MESSAGES.POST.ERROR.LIKE_FAILED);
    }
  }

  async unlikePost(postId: number, walletAddress: string): Promise<void> {
    const like = await this.likesRepository.findOne({
      where: {
        post_id: postId,
        wallet_address: walletAddress.toLowerCase(),
      },
    });

    if (!like) {
      throw new BadRequestException(MESSAGES.POST.ERROR.NOT_LIKED);
    }

    try {
      await this.likesRepository.remove(like);
    } catch (error) {
      throw new BadRequestException(MESSAGES.POST.ERROR.UNLIKE_FAILED);
    }
  }

  async deletePost(postId: number, walletAddress: string): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(MESSAGES.POST.ERROR.NOT_FOUND);
    }

    if (post.wallet_address.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new BadRequestException(MESSAGES.POST.ERROR.UNAUTHORIZED);
    }

    try {
      // Delete all likes and comments first
      await this.likesRepository.delete({ post_id: postId });
      await this.commentsRepository.delete({ post_id: postId });
      // Then delete the post
      await this.postsRepository.remove(post);
    } catch (error) {
      throw new BadRequestException(MESSAGES.POST.ERROR.DELETE_FAILED);
    }
  }

  async getPostLikes(postId: number): Promise<{ wallet_address: string; username?: string; profile_pic_url?: string }[]> {
    const likes = await this.likesRepository.find({
      where: { post_id: postId },
      relations: ['user'],
    });

    return likes.map(like => ({
      wallet_address: like.wallet_address,
      username: like.user?.username,
      profile_pic_url: like.user?.profile_pic_url,
    }));
  }
}
