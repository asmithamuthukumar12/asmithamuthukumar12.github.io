// get references to page elements
const form = document.querySelector("#js-form");
const nameInput = document.querySelector("#js-name-input");
const resultsDiv = document.querySelector("#js-results");
const clearBtn = document.querySelector("#js-clear");

// loading box
const loadingBox = document.querySelector("#js-loading");
const loadingText = document.querySelector("#js-loading-text");

// when the form is submitted, call getPrediction()
form.addEventListener("submit", function (event) {
  event.preventDefault();
  getPrediction();
});

// when "Clear" is clicked, clear everything
clearBtn.addEventListener("click", function () {
  nameInput.value = "";
  resultsDiv.textContent = "";
});

// main function to get age and gender predictions
async function getPrediction() {
  const name = nameInput.value.trim();

  // if nothing entered, show alert
  if (name === "") {
    alert("Please enter a name first!");
    return;
  }

  // show loading spinner and text
  loadingText.textContent = `Fetching data for "${name}"...`;
  loadingBox.classList.remove("hidden");
  resultsDiv.textContent = "";

  // wait 1 second just to show the loading effect
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const ageResponse = await fetch(`https://api.agify.io/?name=${name}`);
  const genderResponse = await fetch(`https://api.genderize.io/?name=${name}`);

  // convert responses to JSON
  const ageData = await ageResponse.json();
  const genderData = await genderResponse.json();

  // get results or fallback text
  const age = ageData.age ? ageData.age : "unknown";
  const gender = genderData.gender ? genderData.gender : "unknown";

  // show the results
  resultsDiv.innerHTML = `
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Predicted Age:</strong> ${age}</p>
    <p><strong>Predicted Gender:</strong> ${gender}</p>
  `;

  // hide the loading spinner
  loadingBox.classList.add("hidden");
}