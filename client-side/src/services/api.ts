import axios from "axios";
import { User, Post, Comment } from "../types";

const BASE_URL = "http://localhost:5000";

const authData = {
  email: "e22cseu0810@bennett.edu.in",
  name: "harsh",
  rollNo: "e22cseu0810",
  accessCode: "rtCHZJ",
  clientID: "e559660f-f7f2-4e85-b894-35b4fd815685",
  clientSecret: "BgKmTqtvyZNTTMAj"
};

let authToken: string | null = null;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authenticate = async () => {
  try {
    const response = await api.post('/auth', authData);
    console.log('Auth response:', response.data);
    
    if (response.data && response.data.access_token) {
      authToken = response.data.access_token;
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      return authToken;
    } else {
      throw new Error('Invalid authentication response');
    }
  } catch (error: any) {
    console.error('Authentication failed:', error.response || error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    if (!authToken) {
      await authenticate();
    }
    const response = await api.get("/users");
    const usersData = response.data.users || response.data;
    return Object.entries(usersData).map(([id, name]) => ({
      id,
      name: String(name)
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getPosts = async (userId?: string): Promise<Post[]> => {
  try {
    if (!authToken) {
      await authenticate();
    }
    const url = userId ? `/users/${userId}/posts` : '/posts';
    const response = await api.get(url);
    return response.data.posts || [];
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    return [];
  }
};

export const getTopUsers = async (): Promise<User[]> => {
  try {
    const users = await getUsers();
    const usersWithPostCounts = await Promise.all(
      users.map(async (user) => {
        try {
          const posts = await getPosts(user.id);
          return {
            ...user,
            postCount: posts?.length || 0
          };
        } catch (error) {
          console.error(`Error fetching posts for user ${user.id}:`, error);
          return { ...user, postCount: 0 };
        }
      })
    );

    return usersWithPostCounts
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching top users:", error);
    throw error;
  }
};

export const getTrendingPosts = async (): Promise<Post[]> => {
  try {
    if (!authToken) {
      await authenticate();
    }
    const allPosts = await getPosts();
    return allPosts.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
  } catch (error) {
    console.error("Error fetching trending posts:", error);
    throw error;
  }
};

export const getLatestPosts = async (): Promise<Post[]> => {
  try {
    if (!authToken) {
      await authenticate();
    }
    const response = await api.get("/posts");
    return response.data.posts || [];
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    throw error;
  }
};

export const getComments = async (postId: number): Promise<any[]> => {
  try {
    if (!authToken) {
      await authenticate();
    }
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data.comments || [];
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    return [];
  }
};
