import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPosts, getComments } from "../services/api";

interface UserPost {
  id: number;
  userid: number;
  content: string;
  comments?: Comment[];
}

interface Comment {
  id: number;
  postid: number;
  content: string;
}

const UserPosts = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<UserPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [loadingComments, setLoadingComments] = useState<{ [key: number]: boolean }>({});

  const fetchComments = async (postId: number) => {
    if (posts.find(p => p.id === postId)?.comments) return;
    
    setLoadingComments(prev => ({ ...prev, [postId]: true }));
    try {
      const comments = await getComments(postId);
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post.id === postId 
            ? { ...post, comments }
            : post
        )
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handlePostClick = (postId: number) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      fetchComments(postId);
    }
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!userId) return;
        const fetchedPosts = await getPosts(userId);
        const transformedPosts = fetchedPosts.map(post => ({
          id: post.id,
          userid: Number(post.userId),
          content: post.content
        }));
        setPosts(transformedPosts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center mb-12">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300"
        >
          <svg 
            className="w-6 h-6 mr-2 transform transition-transform group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 className="text-4xl font-bold ml-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          User Posts
        </h1>
      </div>
      
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
          >
            <div 
              onClick={() => handlePostClick(post.id)}
              className="p-8 cursor-pointer hover:bg-gray-50 transition-colors duration-300"
            >
              <p className="text-gray-700 text-lg leading-relaxed">{post.content}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">Post ID: {post.id}</span>
                <button 
                  className="flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {expandedPost === post.id ? "Hide Comments" : "Show Comments"}
                  <svg 
                    className={`w-5 h-5 ml-2 transform transition-transform duration-300 ${
                      expandedPost === post.id ? "rotate-180" : ""
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {expandedPost === post.id && (
              <div className="border-t border-gray-100 bg-gray-50 p-8 transform transition-all duration-300">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">Comments</h3>
                {loadingComments[post.id] ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-white rounded-xl p-6 shadow-sm transform transition-all duration-300 hover:scale-[1.01] hover:shadow-md"
                        >
                          <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">No comments yet</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No posts found for this user.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPosts; 