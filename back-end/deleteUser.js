// deleteUser.js

// 1. Backend Logic

const express = require('express');
const { UserModel } = require('./models'); // Adjust the path as necessary
const router = express.Router();
const authentication = require('./middleware/authentication');
const authorisation = require('./middleware/authorisation');

// Controller function to delete a user by username
async function delete_user_by_username(req, res) {
  try {
    const { username } = req.body;

    // Validate if username is provided
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Find and delete the user
    const user = await UserModel.destroy({
      where: {
        username: username,
      },
    });

    // Check if user was deleted
    if (user) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Route to delete a user by username
router.post(
  '/auth/delete/user',
  authentication,
  authorisation({ isAdmin: false }),
  delete_user_by_username
);

// Export the router if using in a larger application
module.exports = router;

// 2. Frontend Logic

// Function to handle user deletion form submission
document.addEventListener('DOMContentLoaded', () => {
  const deleteUserForm = document.createElement('form');
  deleteUserForm.id = 'delete-user-form';
  deleteUserForm.innerHTML = `
    <label for="other-username">Username to delete:</label>
    <input type="text" id="other-username" name="other-username" required>
    <button type="submit">Delete User</button>
  `;
  document.body.appendChild(deleteUserForm);

  document.getElementById('delete-user-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('other-username').value;

    try {
      const response = await fetch('http://localhost:4001/auth/delete/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while trying to delete the user.');
    }
  });
});
