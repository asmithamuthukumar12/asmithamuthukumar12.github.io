const form = document.querySelector("#js-form");
const categorySelect = document.querySelector("#js-category");
const resultsDiv = document.querySelector("#js-results");
const clearBtn = document.querySelector("#js-clear");
const loadingBox = document.querySelector("#js-loading");
const loadingText = document.querySelector("#js-loading-text");
const nextBtn = document.querySelector("#js-next");

const apiKey = "97ac3038-c750-44a1-ae21-3a350ce731d1";

let savedCategory = localStorage.getItem("savedCategory");
let currentPage = 1;  
let pageSize = 5;    

if (savedCategory) {
  categorySelect.value = savedCategory;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  currentPage = 1; 
  getNews();
});

clearBtn.addEventListener("click", function () {
  localStorage.removeItem("savedCategory");
  resultsDiv.textContent = "";
  categorySelect.value = "dmoz/Society/Issues/Warfare_and_Conflict";
  currentPage = 1;
});

// fetch next page
nextBtn.addEventListener("click", function () {
  currentPage = currentPage + 1;
  getNews();
});

function getNews() {
  let categoryUri = categorySelect.value;
  localStorage.setItem("savedCategory", categoryUri);

  loadingText.textContent = "Fetching articles...";
  loadingBox.classList.remove("hidden");
  resultsDiv.textContent = "";
//dontkeepshowingthemthesameones
  let offset = (currentPage - 1) * pageSize;

  let url =
    "https://eventregistry.org/api/v1/article/getArticles?apiKey=" +
    apiKey +
    "&categoryUri=" +
    categoryUri +
    "&resultType=articles&articlesSortBy=date&articlesCount=" +
    pageSize +
    "&articlesOffset=" +
    offset;

  console.log("Fetching from:", url);

  fetch(url)
    .then(function (response) {
      console.log("Status code:", response.status);

      if (response.status !== 200) {
        resultsDiv.innerHTML =
          "<p><strong>Status Code:</strong> " + response.status + "</p>";
      }

      return response.json();
    })
    .then(function (data) {
      if (!data.articles || !data.articles.results || data.articles.results.length === 0) {
        resultsDiv.innerHTML += "<p>No news found for this category.</p>";
      } else {
        let articleList = "";

        for (let i = 0; i < data.articles.results.length; i++) {
          let a = data.articles.results[i];
          articleList += "<p><strong>" + a.title + "</strong></p>";
          if (a.body) {
            articleList += "<p>" + a.body.substring(0, 150) + "...</p>";
          } else {
            articleList += "<p>No description.</p>";
          }
          articleList +=
            '<p><a href="' + a.url + '" target="_blank">Read more</a></p><hr>';
        }

        resultsDiv.innerHTML += articleList;
      }

      loadingBox.classList.add("hidden");
    })
    .catch(function (error) {
      console.log("Error:", error);
      resultsDiv.innerHTML = "<p>There was a problem loading the news.</p>";
      loadingBox.classList.add("hidden");
    });
}
