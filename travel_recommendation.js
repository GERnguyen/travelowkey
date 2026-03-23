var rcm_data = {};

fetch("travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    rcm_data = data;
  })
  .catch((error) => {
    console.error("Error fetching travel recommendations:", error);
  });

const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-btn");
const clearButton = document.querySelector("#clear-btn");
const resultsContainer = document.querySelector("#results-container");

searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query || !rcm_data.countries) {
    displayResults([]);
    return;
  }

  // Normalize keyword variations
  const keywordMap = {
    beach: ["beach", "beaches"],
    temple: ["temple", "temples"],
  };

  let results = [];

  // Search for beaches (cities and top-level beaches array)
  if (keywordMap.beach.includes(query)) {
    // From cities
    rcm_data.countries.forEach((country) => {
      country.cities.forEach((city) => {
        if (city.description.toLowerCase().includes("beach")) {
          results.push({
            name: city.name,
            description: city.description,
            imageUrl: city.imageUrl,
            country: country.name,
          });
        }
      });
    });
    // From top-level beaches
    if (Array.isArray(rcm_data.beaches)) {
      rcm_data.beaches.forEach((beach) => {
        results.push({
          name: beach.name,
          description: beach.description,
          imageUrl: beach.imageUrl,
          country: beach.country || "",
        });
      });
    }
  } else if (keywordMap.temple.includes(query)) {
    // From cities
    rcm_data.countries.forEach((country) => {
      country.cities.forEach((city) => {
        if (city.description.toLowerCase().includes("temple")) {
          results.push({
            name: city.name,
            description: city.description,
            imageUrl: city.imageUrl,
            country: country.name,
          });
        }
      });
    });
    // From top-level temples
    if (Array.isArray(rcm_data.temples)) {
      rcm_data.temples.forEach((temple) => {
        results.push({
          name: temple.name,
          description: temple.description,
          imageUrl: temple.imageUrl,
          country: temple.country || "",
        });
      });
    }
  } else {
    // Search for country name
    rcm_data.countries.forEach((country) => {
      if (country.name.toLowerCase().includes(query)) {
        country.cities.forEach((city) => {
          results.push({
            name: city.name,
            description: city.description,
            imageUrl: city.imageUrl,
            country: country.name,
          });
        });
      }
    });
    // Also search top-level beaches and temples for country match
    if (Array.isArray(rcm_data.beaches)) {
      rcm_data.beaches.forEach((beach) => {
        if (
          beach.name.toLowerCase().includes(query) ||
          (beach.description && beach.description.toLowerCase().includes(query))
        ) {
          results.push({
            name: beach.name,
            description: beach.description,
            imageUrl: beach.imageUrl,
            country: beach.country || "",
          });
        }
      });
    }
    if (Array.isArray(rcm_data.temples)) {
      rcm_data.temples.forEach((temple) => {
        if (
          temple.name.toLowerCase().includes(query) ||
          (temple.description &&
            temple.description.toLowerCase().includes(query))
        ) {
          results.push({
            name: temple.name,
            description: temple.description,
            imageUrl: temple.imageUrl,
            country: temple.country || "",
          });
        }
      });
    }
  }

  // Show at least two recommendations if available
  displayResults(results.slice(0, 2));
});

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
});

function displayResults(results) {
  resultsContainer.innerHTML = "";
  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>No recommendations found.</p>";
    return;
  }
  results.forEach((item) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("result-item");
    resultItem.innerHTML = `
      <h3>${item.name} (${item.country})</h3>
      <img src="${item.imageUrl}" alt="${item.name}" style="max-width:200px;display:block;margin-bottom:8px;" />
      <p>${item.description}</p>
    `;
    resultsContainer.appendChild(resultItem);
  });
}
