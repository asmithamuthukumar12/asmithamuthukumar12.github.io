
const form = document.querySelector("#js-form");
const nameInput = document.querySelector("#js-name-input");
const resultsDiv = document.querySelector("#js-results");
const clearBtn = document.querySelector("#js-clear");
const loadingBox = document.querySelector("#js-loading");
const loadingText = document.querySelector("#js-loading-text");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  getPrediction();
});

clearBtn.addEventListener("click", function () {
  nameInput.value = "";
  resultsDiv.textContent = "";
});

async function getPrediction() {
  const name = nameInput.value.trim();
  if (name === "") {
    alert("Please enter a name first!");
    return;
  }

  loadingText.textContent = `Fetching data for "${name}"...`;
  loadingBox.classList.remove("hidden");
  resultsDiv.textContent = "";

  // wait 1 second just to see the loading lol
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const ageResponse = await fetch(`https://api.agify.io/?name=${name}`);
  const genderResponse = await fetch(`https://api.genderize.io/?name=${name}`);

  const ageData = await ageResponse.json();
  const genderData = await genderResponse.json();


  const age = ageData.age ? ageData.age : "unknown";
  const gender = genderData.gender ? genderData.gender : "unknown";


  resultsDiv.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Predicted Age:</strong> ${age}</p>
    <p><strong>Predicted Gender:</strong> ${gender}</p>
  `;

  // hide spinner
  loadingBox.classList.add("hidden");
}