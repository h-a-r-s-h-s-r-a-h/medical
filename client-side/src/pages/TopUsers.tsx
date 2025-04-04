import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopUser } from "../types";
import { getTopUsers } from "../services/api";

const TopUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const data = await getTopUsers();
        console.log(data);
        setUsers(
          data.filter(
            (user): user is TopUser => typeof user.postCount === "number"
          )
        );
      } catch (error) {
        console.error("Error fetching top users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []);

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}/posts`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const getBadgeColor = (index: number) => {
    switch (index) {
      case 0:
        return "from-yellow-400 to-yellow-500"; 
      case 1:
        return "from-gray-300 to-gray-400";
      case 2:
        return "from-amber-600 to-amber-700";
      default:
        return "from-gray-100 to-gray-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Top Users
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((user, index) => (
          <div
            key={user.id}
            onClick={() => handleUserClick(user.id)}
            className="group bg-white rounded-2xl shadow-xl overflow-hidden relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div
              className={`absolute left-0 top-0 w-2 h-full bg-gradient-to-b ${getBadgeColor(
                index
              )}`}
            />
            <div className="p-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                  <img
                    src={"/avatar.png"}
                    alt={`${user.name}'s avatar`}
                    className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {user.name}
                  </h2>
                  <div className="flex items-center mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium">
                      {user.postCount} posts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopUsers;
