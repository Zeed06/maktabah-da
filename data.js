// --- Login Modal ---
if (!document.getElementById('modalLogin')) {
  const loginModal = document.createElement('div');
  loginModal.id = 'modalLogin';
  loginModal.style.display = 'none'; // default: hidden
  loginModal.style.position = 'fixed';
  loginModal.style.top = '0';
  loginModal.style.left = '0';
  loginModal.style.width = '100vw';
  loginModal.style.height = '100vh';
  loginModal.style.background = 'rgba(0,0,0,0.5)';
  loginModal.style.justifyContent = 'center';
  loginModal.style.alignItems = 'center';
  loginModal.innerHTML = `
    <div style="background:#fff;padding:32px;border-radius:8px;min-width:300px;box-shadow:0 2px 8px rgba(0,0,0,0.3);text-align:center;position:relative;">
      <button id="closeModalLogin" style="position:absolute;top:12px;right:12px;background:#e74c3c;color:#fff;border:none;border-radius:50%;width:32px;height:32px;font-size:1.2em;cursor:pointer;">&times;</button>
      <h2>Login Admin</h2>
      <input id="username" type="text" placeholder="Username" style="width:90%;margin-bottom:10px;padding:8px;border-radius:4px;border:1px solid #ccc;"><br>
      <input id="password" type="password" placeholder="Password" style="width:90%;margin-bottom:10px;padding:8px;border-radius:4px;border:1px solid #ccc;"><br>
      <button id="loginBtn" style="padding:8px 24px;border-radius:4px;background:cornflowerblue;color:#fff;border:none;">Login</button>
      <div id="loginError" style="color:red;margin-top:10px;"></div>
    </div>
  `;
  document.body.appendChild(loginModal);

  document.getElementById('loginBtn').onclick = function() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    // Hanya admin yang bisa login
    if (user === 'admin' && pass === 'admin') {
      localStorage.setItem('role', 'admin');
      loginModal.style.display = 'none';
      updateAuthButtons();
    } else {
      document.getElementById('loginError').innerText = 'Username/password salah!';
    }
  };

  // Fungsi tombol close
  document.getElementById('closeModalLogin').onclick = function() {
    loginModal.style.display = 'none';
  };
}
// --- End Login Modal ---

const data = [...aqidah,...tarikh];
const nav = document.querySelector('main nav');
const navs = document.querySelectorAll('main nav button');

// NavBar
nav.addEventListener('click', (e) => {
  if (e.target.className == 'btn') {
    navs.forEach(ee => {
      ee.className = 'btn'
    })
    e.target.className = 'btn active';
  }
})

// Render
function renderCards(list) {
  const container = document.querySelector('.content');
  container.innerHTML = list.map(person => {
    let bg = '';
    if (person.tema === 'aqidah' || person.tema === 'adab' || person.tema === 'fiqih') {
      bg = 'background:steelblue;color:white;';
    } else if (person.tema === 'hadits' || person.tema === 'mustholah') {
      bg = 'background:chocolate;color:white;';
    } else if (person.tema === 'tarikh' || person.tema === 'tafsir' || person.tema === 'fatawa') {
      bg = 'background:tomato;color:white;';
    }
    return `
      <div class="card" style="${bg}">
        <div class="head"><h1>${person.judul}</h1></div>
        <div class="main"><h3>PENULIS : <span>${person.pembuat}</span></h3>
        <h3>PENERBIT : <span>${person.penerbit}</span></h3></div>
        <div class="footer">
          <div><h5>Total Buku / Jilid : ${person.totalBuku}</h5>
          <h5>No : ${person.no} |  Rak : 1</h5></div>
          <div class="sinopsis">
            <button class="btn-sinopsis" data-no="${person.no}" data-tema="${person.tema}">Sinopsis</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Modal HTML
if (!document.getElementById('modalSinopsis')) {
  const modal = document.createElement('div');
  modal.id = 'modalSinopsis';
  modal.innerHTML = `
    <div id="modalContent"></div>
    <button id="closeModalSinopsis">Tutup</button>
  `;
  document.body.appendChild(modal);
  document.getElementById('closeModalSinopsis').onclick = function() {
    modal.style.display = 'none';
  };
}

// Event delegation for sinopsis button
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-sinopsis')) {
    const no = e.target.getAttribute('data-no');
    const tema = e.target.getAttribute('data-tema');
    const book = data.find(b => b.no == no && b.tema == tema);
    let sinopsis = localStorage.getItem(`sinopsis_${tema}_${no}`);
    if (!sinopsis) sinopsis = book.sinopsis || 'Sinopsis belum tersedia.';
    const modal = document.getElementById('modalSinopsis');
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      document.getElementById('modalContent').innerHTML = `
        <h3>${book.judul}</h3>
        <textarea id="editSinopsis" rows="6" style="width:100%;">${sinopsis}</textarea>
        <br>
        <button id="saveSinopsis">Simpan Sinopsis</button>
      `;
      document.getElementById('saveSinopsis').onclick = function() {
        const newSinopsis = document.getElementById('editSinopsis').value;
        localStorage.setItem(`sinopsis_${tema}_${no}`, newSinopsis);
        alert('Sinopsis berhasil disimpan!');
        modal.style.display = 'none';
      };
    } else {
      document.getElementById('modalContent').innerHTML = `
        <h3>${book.judul}</h3>
        <div style="white-space:pre-line;background:#eee;padding:12px;border-radius:6px;">${sinopsis}</div>
      `;
    }
    modal.style.display = 'block';
  }
});

function tampil(tema) {
  renderCards(data.filter(item => item.tema === tema));
}
tampil('aqidah');
        
// Search
const onSearch = () => {
  const input = document.querySelector('#search');
  const filter = input.value.trim().toUpperCase();

  // Jika ada input, filter card
  if (filter) {
    function tampil() {
  renderCards(data); // tampilkan semua card dari data tanpa filter tema
}
tampil();
    document.querySelectorAll('.card').forEach(card => {
      const title = card.querySelector('.head h1').textContent.toUpperCase();
      if (!title.includes(filter)) {
        card.style.display = 'none';
      }
    });
  }
}

// Show/hide login/logout button based on role
function updateAuthButtons() {
  const btnLogin = document.getElementById('btnLogin');
  const btnLogout = document.getElementById('btnLogout');
  if (localStorage.getItem('role') === 'admin') {
    btnLogin.style.display = 'none';
    btnLogout.style.display = 'inline-block';
  } else {
    btnLogin.style.display = 'inline-block';
    btnLogout.style.display = 'none';
  }
}

// Logout function
function logout() {
  localStorage.removeItem('role');
  updateAuthButtons();
}

// Button events
document.getElementById('btnLogin').onclick = function() {
  document.getElementById('modalLogin').style.display = 'flex';
};
document.getElementById('btnLogout').onclick = logout;

// Call on page load
updateAuthButtons();

// Logout otomatis saat browser/tab ditutup
window.addEventListener('beforeunload', function() {
  localStorage.removeItem('role');
});