const newGameBtn = document.querySelector("#js-new-quote");
const infoBtn = document.querySelector("#js-tweet");

let current = {
  id: "",
  title: "",
  description: "",
  genre: "",
  platform: "",
  thumbnail: "",
  url: ""
};

const baseURL = "https://www.freetogame.com/api";

newGameBtn.addEventListener("click", getNewGame);
infoBtn.addEventListener("click", showInfo);

async function getNewGame() {
  try {
    const response = await fetch(baseURL + "/games");
    const games = await response.json();

    const randomIndex = Math.floor(Math.random() * games.length);
    const randomGame = games[randomIndex];

    current.id = randomGame.id;

    const gameDetails = await fetch(baseURL + "/game?id=" + current.id);
    const gameData = await gameDetails.json();

    current.title = gameData.title;
    current.description = gameData.short_description;
    current.genre = gameData.genre;
    current.platform = gameData.platform;
    current.thumbnail = gameData.thumbnail;
    current.url = gameData.game_url;

    showGame(current);
  } catch (error) {
    alert("Could not load a game. Try again!");
    console.log(error);
  }
}

function showGame(game) {
  const title = document.querySelector("#js-quote-text");
  const info = document.querySelector("#js-answer-text");
  const image = document.querySelector("#js-image");

  title.textContent = game.title;
  info.textContent = "";
  image.src = game.thumbnail;
  image.alt = game.title;
}

function showInfo() {
  const info = document.querySelector("#js-answer-text");
  info.innerHTML = `
    <p><strong>Genre:</strong> ${current.genre}</p>
    <p><strong>Platform:</strong> ${current.platform}</p>
    <p>${current.description}</p>
    <p><a href="${current.url}" target="_blank">Play Now</a></p>
  `;
}

getNewGame();
