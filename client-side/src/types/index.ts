export interface User {
  id: string;
  name: string;
  postCount?: number;
  avatarUrl?: string;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  commentCount?: number;
  imageUrl?: string;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
}

export interface TopUser extends User {
  postCount: number;
}

export interface TrendingPost extends Post {
  commentCount: number;
  user?: User;
} 