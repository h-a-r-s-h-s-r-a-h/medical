import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopUsers from './pages/TopUsers';
import UserPosts from './pages/UserPosts';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <main className="pt-20 pb-12 px-4 transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<TopUsers />} />
              <Route path="/top-users" element={<TopUsers />} />
              {/* <Route path="/trending" element={<TrendingPosts />} /> */}
              <Route path="/users/:userId/posts" element={<UserPosts />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
