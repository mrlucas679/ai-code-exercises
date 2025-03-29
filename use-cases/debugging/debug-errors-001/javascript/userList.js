/**
 * Example module demonstrating common debugging scenarios in frontend user list rendering.
 * Includes both problematic and corrected implementations.
 */

class UserListManager {
    /**
     * Problematic implementation that assumes array size.
     * Will throw errors when users array has fewer than 5 elements.
     */
    static renderUserListBuggy(users) {
        const userListElement = document.getElementById('user-list');
        userListElement.innerHTML = '';

        // BUG: Loop assumes the users array always has at least 5 elements
        for (let i = 0; i < 5; i++) {
            const user = users[i];

            // Error occurs here when i >= users.length
            const userName = user.name;
            const userEmail = user.email;

            const userElement = document.createElement('div');
            userElement.innerHTML = `
                <div class="user-card">
                    <h3>${userName}</h3>
                    <p>${userEmail}</p>
                </div>
            `;
            userListElement.appendChild(userElement);
        }
    }

    /**
     * Fixed implementation that properly checks array bounds.
     */
    static renderUserListFixed(users) {
        const userListElement = document.getElementById('user-list');
        userListElement.innerHTML = '';

        // FIXED: Use actual array length
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userElement = document.createElement('div');
            userElement.innerHTML = `
                <div class="user-card">
                    <h3>${user.name}</h3>
                    <p>${user.email}</p>
                </div>
            `;
            userListElement.appendChild(userElement);
        }
    }

    /**
     * Enhanced implementation with error handling and data validation.
     */
    static renderUserListEnhanced(users) {
        try {
            // Input validation
            if (!Array.isArray(users)) {
                throw new Error('Input must be an array of users');
            }

            const userListElement = document.getElementById('user-list');
            if (!userListElement) {
                throw new Error('User list element not found in DOM');
            }

            userListElement.innerHTML = '';

            // Handle empty list case
            if (users.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = 'No users found';
                userListElement.appendChild(emptyMessage);
                return;
            }

            // Process each user with data validation
            users.forEach((user, index) => {
                try {
                    if (!user || typeof user !== 'object') {
                        throw new Error(`Invalid user data at index ${index}`);
                    }

                    const userElement = document.createElement('div');
                    userElement.className = 'user-card';

                    // Validate required fields
                    const userName = user.name || 'Unknown User';
                    const userEmail = user.email || 'No email provided';

                    userElement.innerHTML = `
                        <div class="user-card ${user.active ? 'active' : 'inactive'}">
                            <h3>${this.escapeHtml(userName)}</h3>
                            <p>${this.escapeHtml(userEmail)}</p>
                            ${user.role ? `<span class="role">${this.escapeHtml(user.role)}</span>` : ''}
                        </div>
                    `;

                    userListElement.appendChild(userElement);
                } catch (error) {
                    console.error(`Error processing user ${index}:`, error);
                    // Create error card for this user
                    const errorElement = document.createElement('div');
                    errorElement.className = 'user-card error';
                    errorElement.innerHTML = `
                        <div class="error-message">
                            Error displaying user ${index + 1}
                        </div>
                    `;
                    userListElement.appendChild(errorElement);
                }
            });
        } catch (error) {
            console.error('Error rendering user list:', error);
            // Display error message in UI
            const errorContainer = document.createElement('div');
            errorContainer.className = 'error-container';
            errorContainer.textContent = `Error: ${error.message}`;
            document.body.appendChild(errorContainer);
        }
    }

    /**
     * Helper method to escape HTML and prevent XSS.
     */
    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Example usage and tests
function demonstrateUserList() {
    // Test data
    const users = [
        { name: "John Doe", email: "john@example.com", role: "Admin", active: true },
        { name: "Jane Smith", email: "jane@example.com", role: "User", active: true },
        { name: "Bob Johnson", email: "bob@example.com", role: "User", active: false }
    ];

    // Test buggy version
    console.log("Testing buggy version (will show errors):");
    try {
        UserListManager.renderUserListBuggy(users);
    } catch (error) {
        console.error("Buggy version error:", error);
    }

    // Test fixed version
    console.log("\nTesting fixed version:");
    try {
        UserListManager.renderUserListFixed(users);
    } catch (error) {
        console.error("Fixed version error:", error);
    }

    // Test enhanced version
    console.log("\nTesting enhanced version:");
    try {
        UserListManager.renderUserListEnhanced(users);
    } catch (error) {
        console.error("Enhanced version error:", error);
    }

    // Test error cases
    console.log("\nTesting error cases:");

    // Test with null
    console.log("Testing with null input:");
    try {
        UserListManager.renderUserListEnhanced(null);
    } catch (error) {
        console.error("Null input error:", error);
    }

    // Test with malformed user data
    console.log("Testing with malformed user data:");
    const malformedUsers = [
        { name: "John Doe" }, // Missing email
        null, // Invalid user
        { email: "invalid@example.com" } // Missing name
    ];
    try {
        UserListManager.renderUserListEnhanced(malformedUsers);
    } catch (error) {
        console.error("Malformed data error:", error);
    }
}

// Export for use in tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserListManager, demonstrateUserList };
}

