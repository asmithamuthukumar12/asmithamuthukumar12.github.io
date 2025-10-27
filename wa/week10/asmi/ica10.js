const form = document.querySelector("#js-form");
const nameInput = document.querySelector("#js-name-input");
const resultsDiv = document.querySelector("#js-results");
const clearBtn = document.querySelector("#js-clear");

// Loading UI elements
const loadingBox = document.querySelector("#js-loading");
const loadingText = document.querySelector("#js-loading-text");

// Convert 2-letter codes to full country names
const countryNames = new Intl.DisplayNames(["en"], { type: "region" });

// Helper: enforce a minimum delay (ms) for UX — here we use 2000ms
function withMinDelay(promise, ms = 2000) {
  return Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]).then(([result]) => result);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getPrediction();
});

clearBtn.addEventListener("click", clearResults);

async function getPrediction() {
  const name = nameInput.value.trim();
  if (!name) {
    alert("Please enter a name first!");
    return;
  }

  // Show loading UI for exactly ~2 seconds
  showLoading(`Fetching data for “${name}”…`);

  try {
    const fetchAll = Promise.all([
      fetch(`https://api.agify.io/?name=${encodeURIComponent(name)}`),
      fetch(`https://api.genderize.io/?name=${encodeURIComponent(name)}`),
      fetch(`https://api.nationalize.io/?name=${encodeURIComponent(name)}`),
    ]).then(async ([ageRes, genderRes, nationRes]) => {
      if (!ageRes.ok || !genderRes.ok || !nationRes.ok) {
        throw new Error("API returned an error");
      }
      const [ageData, genderData, nationData] = await Promise.all([
        ageRes.json(),
        genderRes.json(),
        nationRes.json(),
      ]);
      return { ageData, genderData, nationData };
    });

    // Ensure the loading UI stays visible for >= 2s
    const { ageData, genderData, nationData } = await withMinDelay(fetchAll, 2000);

    const age = ageData.age ? `${ageData.age} years old` : "Unknown age";
    const gender = genderData.gender
      ? `${genderData.gender} (${Math.round(genderData.probability * 100)}%)`
      : "Unknown gender";

    let nationality = "Unknown nationality";
    if (nationData.country && nationData.country.length > 0) {
      const top = nationData.country[0]; // most likely
      const fullName = countryNames.of(top.country_id) || top.country_id;
      nationality = `${fullName} (${Math.round(top.probability * 100)}%)`;
    }

    resultsDiv.innerHTML = `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Predicted Age:</strong> ${age}</p>
      <p><strong>Predicted Gender:</strong> ${gender}</p>
      <p><strong>Most Likely Nationality:</strong> ${nationality}</p>
    `;
  } catch (err) {
    console.error(err);
    resultsDiv.textContent = "Error fetching prediction. Please try again.";
  } finally {
    hideLoading();
  }
}

function clearResults() {
  nameInput.value = "";
  resultsDiv.textContent = "";
}

// Loading helpers
function showLoading(message) {
  loadingText.textContent = message || "Fetching data…";
  loadingBox.classList.remove("hidden");
}

function hideLoading() {
  loadingBox.classList.add("hidden");
}

// Basic HTML escaping for the displayed name
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[m];
  });
}
