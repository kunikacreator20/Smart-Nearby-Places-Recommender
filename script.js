function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation not supported by browser");
    }
}

function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let category = document.getElementById("category").value;

    document.getElementById("output").innerHTML = "🔍 Finding nearby places...";

    let query = `
    [out:json];
    (
      node["amenity"="${category}"](around:3000,${lat},${lon});
      way["amenity"="${category}"](around:3000,${lat},${lon});
      relation["amenity"="${category}"](around:3000,${lat},${lon});
    );
    out center;
    `;

    let url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.elements.length === 0) {
                document.getElementById("output").innerHTML = "No nearby places found.";
                return;
            }

            let result = `<h3>📍 Nearby ${category}</h3>`;
            data.elements.slice(0, 10).forEach(place => {
                let name = place.tags.name || "Unnamed Place";
                result += `<p>✅ ${name}</p>`;
            });

            document.getElementById("output").innerHTML = result;
        })
        .catch(err => {
            document.getElementById("output").innerHTML = "Error fetching nearby data.";
        });
}
