// Simple form validation + save submissions to localStorage and display them
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');
const savedMessages = document.getElementById('savedMessages');

function loadMessages(){
  const data = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
  savedMessages.innerHTML = '';
  if(data.length === 0){
    savedMessages.innerHTML = '<p class="muted">No saved messages yet.</p>';
    return;
  }
  const list = document.createElement('ul');
  list.className = 'message-list';
  data.slice().reverse().forEach((m, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${m.name}</strong> <em>&lt;${m.email}&gt;</em><p>${m.message}</p>
      <div class="msg-actions"><button data-index="${idx}" class="btn-sm btn-delete">Delete</button></div>`;
    list.appendChild(li);
  });
  savedMessages.appendChild(list);

  // wire up delete buttons
  document.querySelectorAll('.btn-delete').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const i = Number(e.target.getAttribute('data-index'));
      let arr = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
      // `idx` is relative to reversed array; remove correct item
      arr.splice(arr.length - 1 - i, 1);
      localStorage.setItem('portfolio_messages', JSON.stringify(arr));
      loadMessages();
    });
  });
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Basic validation
  if(name.length < 2){
    alert('Please enter your name (min 2 chars).');
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    alert('Please enter a valid email address.');
    return;
  }
  if(message.length < 5){
    alert('Message too short — please write at least 5 characters.');
    return;
  }

  // Save to localStorage
  const arr = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
  arr.push({ name, email, message, date: new Date().toISOString() });
  localStorage.setItem('portfolio_messages', JSON.stringify(arr));

  // reset form and show messages
  form.reset();
  loadMessages();
  alert('Message saved locally! (This demo uses localStorage — messages are only stored on your browser.)');
});

// initialize
loadMessages();

// mobile nav toggle
const mobToggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav ul');
if(mobToggle && nav){
  mobToggle.addEventListener('click', () => {
    const expanded = mobToggle.getAttribute('aria-expanded') === 'true';
    mobToggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}


// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

function setTheme(mode) {
  if(mode === "light"){
    document.body.classList.add("light");
    themeToggle.textContent = "🌞";
  } else {
    document.body.classList.remove("light");
    themeToggle.textContent = "🌙";
  }
  localStorage.setItem("theme", mode);
}

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

// Toggle on click
themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.contains("light");
  setTheme(isLight ? "dark" : "light");
});


// GITHUB FETCHER
const githubForm = document.getElementById("githubForm");
const githubResult = document.getElementById("githubResult");

if(githubForm){
  githubForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const username = document.getElementById("githubUser").value.trim();
    if(!username) return;
    githubResult.innerHTML = "<p>Loading...</p>";
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if(!res.ok) throw new Error("User not found");
      const data = await res.json();
      githubResult.innerHTML = `
        <div class="github-card">
          <img src="${data.avatar_url}" alt="${data.login} avatar" />
          <div>
            <h3>${data.name || data.login}</h3>
            <p>${data.bio || "No bio available"}</p>
            <p><strong>Repos:</strong> ${data.public_repos} | <strong>Followers:</strong> ${data.followers}</p>
            <p><a href="${data.html_url}" target="_blank">View Profile</a></p>
          </div>
        </div>
      `;
    } catch(err){
      githubResult.innerHTML = "<p style='color:red'>Error: " + err.message + "</p>";
    }
  });
}
