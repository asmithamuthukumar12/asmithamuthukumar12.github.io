const form = document.querySelector("#js-form");
const topicSelect = document.querySelector("#js-topic");
const resultsDiv = document.querySelector("#js-results");
const clearBtn = document.querySelector("#js-clear");
const loadingBox = document.querySelector("#js-loading");
const loadingText = document.querySelector("#js-loading-text");

const apiKey = "97ac3038-c750-44a1-ae21-3a350ce731d1";

// load saved topic if available
const savedTopic = localStorage.getItem("savedTopic");
if (savedTopic) {
  topicSelect.value = savedTopic;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  getNews();
});

clearBtn.addEventListener("click", function () {
  localStorage.removeItem("savedTopic");
  resultsDiv.textContent = "";
  topicSelect.value = "technology";
});

async function getNews() {
  const topic = topicSelect.value;
  localStorage.setItem("savedTopic", topic);

  loadingText.textContent = `Fetching ${topic} news…`;
  loadingBox.classList.remove("hidden");
  resultsDiv.textContent = "";

  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${topic}&language=en&apiKey=${apiKey}`
    );

    resultsDiv.innerHTML = `<p><strong>Status Code:</strong> ${response.status}</p>`;

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      resultsDiv.innerHTML += "<p>No news found for this topic.</p>";
    } else {
      const articlesHTML = data.articles
        .slice(0, 5)
        .map(
          (a) => `
          <p><strong>${a.title}</strong></p>
          <p>${a.description ? a.description : "No description available."}</p>
          <p><a href="${a.url}" target="_blank">Read more</a></p>
          <hr>
        `
        )
        .join("");
      resultsDiv.innerHTML += articlesHTML;
    }
  } catch (error) {
    resultsDiv.innerHTML = "<p>There was a problem loading the news.</p>";
  }

  loadingBox.classList.add("hidden");
}
