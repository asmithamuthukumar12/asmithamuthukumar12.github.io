let triviaBtn = document.querySelector("#js-new-quote").addEventListener("click",newGame);

let answerBtn = document.querySelector('#js-tweet').addEventListener('click',showInfo);

let current = {
    title:"",
    description:"",
    genre:"",
    url:"",
};

const endpoint= "https://www.freetogame.com/api/games";

async function newGame() {

    try {
        const response = await fetch(endpoint);
        if (!response.ok){
            throw Error(response.statusText)
        }

        const games = await response.json();

        let randomNumber = Math.random() * games.length;
        let randomGame = games[Math.floor(randomNumber)];

        current.title = randomGame.title;
        current.description= randomGame.short_description;
        current.genre = randomGame.genre;
        current.url = randomGame.game_url;




    }
    catch(err){
        console.log(err)
        alert('failed to get new game');
    }

}   

function displayGame(game){
    const gameTitle = document.querySelector("#js-quote-text");
    const gameInfo = document.querySelector('#js-answer-text');

    gameTitle.textContent = game.title;
    gameInfo.textContent = "";

}

function showInfo() {
    console.log("Showing game info...");
    const gameInfo = document.querySelector('#js-answer-text');
}





newGame();