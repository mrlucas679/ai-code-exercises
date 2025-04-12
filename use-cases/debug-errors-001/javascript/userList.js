// userList.js
function renderUserList(users) {
  const userListElement = document.getElementById('user-list');
  userListElement.innerHTML = '';

  // Loop assumes the users array always has at least 5 elements
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