function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.stringify(JSON.parse(jsonPayload), null, 2);
  } catch {
    return 'Invalid token';
  }
}

async function register() {
  const regMsg = document.getElementById("regMsg");
  regMsg.style.color = 'gray';
  regMsg.innerText = 'Registering...';

  const username = document.getElementById("regUser").value;
  const password = document.getElementById("regPass").value;

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const msg = await res.json();
    regMsg.innerText = msg.msg || msg.error;
    regMsg.style.color = msg.msg ? 'green' : 'red';

    if (msg.msg) {
      document.getElementById("regUser").value = "";
      document.getElementById("regPass").value = "";
    }
  } catch {
    regMsg.innerText = "Something went wrong.";
    regMsg.style.color = 'red';
  }
}

async function login() {
  const loginMsg = document.getElementById("loginMsg");
  loginMsg.innerText = 'Logging in...';
  loginMsg.style.color = 'gray';

  const username = document.getElementById("logUser").value;
  const password = document.getElementById("logPass").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.token) {
      document.getElementById("token").value = data.token;
      document.getElementById("loginMsg").innerText = "Login successful!";
      document.getElementById("loginMsg").style.color = "green";
      await loadBoards();
    } else {
      loginMsg.innerText = data.error || "Login failed";
      loginMsg.style.color = 'red';
    }
  } catch {
    loginMsg.innerText = "Something went wrong.";
    loginMsg.style.color = 'red';
  }
}

function logout() {
  document.getElementById("token").value = '';
  document.getElementById("loginMsg").innerText = 'Logged out';
  document.getElementById("boardList").innerHTML = '';
}

async function createBoard() {
  const title = document.getElementById("boardTitle").value;
  const token = document.getElementById("token").value;
  if (!title || !token) return;

  await fetch("/api/boards", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ title })
  });

  document.getElementById("boardTitle").value = "";
  await loadBoards();
}

async function loadBoards() {
  const token = document.getElementById("token").value;
  if (!token) return;

  const res = await fetch("/api/boards", {
    headers: { "Authorization": "Bearer " + token }
  });
  const boards = await res.json();
  const list = document.getElementById("boardList");
  list.innerHTML = "";
  boards.forEach(b => {
    const li = document.createElement("li");
    li.innerHTML = `${b.title} 
      <button onclick="deleteBoard('${b._id}')">🗑️</button>`;
    list.appendChild(li);
  });
}

async function deleteBoard(id) {
  const token = document.getElementById("token").value;
  await fetch(`/api/boards/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });
  await loadBoards();
}
