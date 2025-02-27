document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generateBtn');
  const jokeText = document.getElementById('jokeText');
  const jokeDelivery = document.getElementById('jokeDelivery');
  const categorySelect = document.getElementById('categorySelect');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const btnText = document.getElementById('btnText');
  const errorAlert = document.getElementById('errorAlert');
  const errorMessage = document.getElementById('errorMessage');
  const saveJokeBtn = document.getElementById('saveJokeBtn');
  const shareFacebookBtn = document.getElementById('shareFacebookBtn');
  const shareInstagramBtn = document.getElementById('shareInstagramBtn');
  const savedJokes = document.getElementById('savedJokes');
  const savedJokesList = document.getElementById('savedJokesList');

  let currentJoke = null;

  function loadSavedJokes() {
    const jokes = JSON.parse(localStorage.getItem('savedJokes') || '[]');
    if (jokes.length > 0) {
      savedJokes.classList.remove('d-none');
      savedJokesList.innerHTML = jokes.map((joke, index) => `
        <div class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <p class="mb-1">${joke.text}</p>
              ${joke.delivery ? `<p class="mb-0 text-info">${joke.delivery}</p>` : ''}
            </div>
            <button class="btn btn-sm btn-outline-danger delete-joke" data-index="${index}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.delete-joke').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          const jokes = JSON.parse(localStorage.getItem('savedJokes') || '[]');
          jokes.splice(index, 1);
          localStorage.setItem('savedJokes', JSON.stringify(jokes));
          loadSavedJokes();
        });
      });
    } 
    else {
      savedJokes.classList.add('d-none');
    }
  }

  function generateJoke() {
    loadingSpinner.classList.remove('d-none');
    btnText.classList.add('d-none');
    errorAlert.classList.add('d-none');
    saveJokeBtn.disabled = true;
    shareFacebookBtn.disabled = true;
    shareInstagramBtn.disabled = true;
  
    const category = categorySelect.value;
    const url = category === 'Any' 
      ? 'https://v2.jokeapi.dev/joke/Any'
      : `https://v2.jokeapi.dev/joke/${category}`;
  
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          let joke = JSON.parse(xhr.responseText);
  
          jokeText.style.opacity = 0;
          jokeDelivery.style.opacity = 0;
  
          setTimeout(() => {
            if (joke.type === 'single') {
              jokeText.textContent = joke.joke;
              jokeDelivery.classList.add('d-none');
              currentJoke = { text: joke.joke };
            } else {
              jokeText.textContent = joke.setup;
              jokeDelivery.textContent = joke.delivery;
              jokeDelivery.classList.remove('d-none');
              currentJoke = { text: joke.setup, delivery: joke.delivery };
            }
  
            jokeText.style.opacity = 1;
            jokeDelivery.style.opacity = 1;
            saveJokeBtn.disabled = false;
            shareFacebookBtn.disabled = false;
            shareInstagramBtn.disabled = false;
          }, 200);
        } else {
          errorMessage.textContent = 'Failed to fetch joke. Please try again.';
          errorAlert.classList.remove('d-none');
        }
        loadingSpinner.classList.add('d-none');
        btnText.classList.remove('d-none');
      }
    };
    xhr.send();
  }
  

  function saveJoke() {
    if (!currentJoke) return;

    const savedJokes = JSON.parse(localStorage.getItem('savedJokes') || '[]');
    savedJokes.push(currentJoke);
    localStorage.setItem('savedJokes', JSON.stringify(savedJokes));
    loadSavedJokes();

    saveJokeBtn.classList.remove('btn-outline-success');
    saveJokeBtn.classList.add('btn-success');
    setTimeout(() => {
      saveJokeBtn.classList.remove('btn-success');
      saveJokeBtn.classList.add('btn-outline-success');
    }, 1000);
  }

  function shareFacebook() {
    if (!currentJoke) return;

    const jokeText = currentJoke.delivery 
      ? `${currentJoke.text}\n${currentJoke.delivery}`
      : currentJoke.text;

      navigator.clipboard.writeText(jokeText).then(() => {
        window.open("https://www.facebook.com/login/","_blank");
      });
  }

  function shareInstagram() {
    if (!currentJoke) return;

    const jokeText = currentJoke.delivery 
      ? `${currentJoke.text}\n${currentJoke.delivery}`
      : currentJoke.text;

      navigator.clipboard.writeText(jokeText).then(() => {
        window.open("https://www.instagram.com/accounts/login/","_blank");
      });
  }

  generateBtn.addEventListener('click', generateJoke);
  saveJokeBtn.addEventListener('click', saveJoke);
  shareFacebookBtn.addEventListener('click', shareFacebook);
  shareInstagramBtn.addEventListener('click', shareInstagram);

  loadSavedJokes();
});