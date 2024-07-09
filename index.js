const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const app = express();
const PORT = 8000;

// Middleware to parse URL-encoded bodies (for POST requests)
app.use(express.urlencoded({ extended: false }));

// Default route
app.get('/', (req, res) => {
    return res.send('Welcome to the home page');
});

// GET all users
app.get('/users', (req, res) => {
    const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    res.send(html);
});

// GET all users (JSON format)
app.get('/api/users', (req, res) => {
    return res.json(users);
});

// GET user by ID
app.get('/api/user/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        return res.json(user);
    } else {
        return res.status(404).json({ error: 'User not found' });
    }
});

// POST a new user
app.post('/api/users', (req, res) => {
    const body = req.body;
    const newUser = { ...body, id: users.length + 1 };
    users.push(newUser);

    // Write updated data to file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).json({ error: 'Error adding user' });
        }
        return res.json({ status: 'success', user: newUser });
    });
});

// DELETE user by ID
app.delete('/api/user/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        users.splice(index, 1);

        // Write updated data to file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).json({ error: 'Error deleting user' });
            }
            return res.json({ status: 'success', message: 'User deleted successfully' });
        });
    } else {
        return res.status(404).json({ error: 'User not found' });
    }
});

// PUT (update) user by ID
app.put('/api/user/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };

        // Write updated data to file
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
            if (err) {
                console.error("Error writing file:", err);
                return res.status(500).json({ error: 'Error updating user' });
            }
            return res.json({ status: 'success', user: users[index] });
        });
    } else {
        return res.status(404).json({ error: 'User not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});
