let cafes = [];
let places = {};
let filteredCafes = [];

async function fetchData() {
  try {
    const [cafesResponse, placesResponse] = await Promise.all([
      fetch(
        "https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/cafes.json"
      ),
      fetch(
        "https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/places.json"
      ),
    ]);
    if (!cafesResponse.ok || !placesResponse.ok) {
      throw new Error("Failed to fetch data");
    }
    const [cafesData, placesData] = await Promise.all([
      cafesResponse.json(),
      placesResponse.json(),
    ]);
    cafes = cafesData.cafes;
    filteredCafes = cafes.slice();
    places = placesData.places.reduce((acc, place) => {
      acc[place.id] = `${place.street_no}
       ${place.locality}, 
       ${place.postal_code}`;
      return acc;
    }, {});
    renderCafeList();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function renderCafeList() {
  const tblBody = document.querySelector("#cafeTable tbody");
  tblBody.innerHTML = "";
  filteredCafes.forEach((cafe) => {
    const row = document.createElement("tr");
    const nameBox = document.createElement("td");
    nameBox.textContent = cafe.name;
    const placeBox = document.createElement("td");
    placeBox.textContent = places[cafe.location_id] || "Unknown";
    row.appendChild(nameBox);
    row.appendChild(placeBox);
    tblBody.appendChild(row);
  });
}

function searchCafes() {
  const searchTerm = document.getElementById("searchBox").value.toLowerCase();
  filteredCafes = searchTerm
    ? cafes.filter((cafe) => cafe.name.toLowerCase().includes(searchTerm))
    : cafes.slice();
  renderCafeList();
}

fetchData();
