import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const EVALUATION_SERVICE_BASE_URL = 'http://20.244.56.144/evaluation-service';

const authData = {
    email: "e22cseu0810@bennett.edu.in",
    name: "harsh",
    rollNo: "e22cseu0810",
    accessCode: "rtCHZJ",
    clientID: "e559660f-f7f2-4e85-b894-35b4fd815685",
    clientSecret: "BgKmTqtvyZNTTMAj"
};

let authToken = null;

async function getAuthToken() {
    if (!authToken) {
        try {
            const response = await axios.post(`${EVALUATION_SERVICE_BASE_URL}/auth`, authData);
            authToken = response.data.access_token;
        } catch (error) {
            console.error('Error getting auth token:', error.message);
            throw error;
        }
    }
    return authToken;
}


app.post('/register', async (req, res) => {
    try {
        const response = await axios.post(`${EVALUATION_SERVICE_BASE_URL}/register`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Registration failed'
        });
    }
});

app.post('/auth', async (req, res) => {
    try {
        const response = await axios.post(`${EVALUATION_SERVICE_BASE_URL}/auth`, authData);
        authToken = response.data.access_token;
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Authentication failed'
        });
    }
});

app.get('/users', async (req, res) => {
    try {
        const token = await getAuthToken();
        const response = await axios.get(`${EVALUATION_SERVICE_BASE_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to fetch users'
        });
    }
});

app.get('/users/:userId/posts', async (req, res) => {
    try {
        const token = await getAuthToken();
        const { userId } = req.params;
        const response = await axios.get(`${EVALUATION_SERVICE_BASE_URL}/users/${userId}/posts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to fetch posts'
        });
    }
});

app.get('/posts/:postId/comments', async (req, res) => {
    try {
        const token = await getAuthToken();
        const { postId } = req.params;
        const response = await axios.get(`${EVALUATION_SERVICE_BASE_URL}/posts/${postId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data || 'Failed to fetch comments'
        });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
