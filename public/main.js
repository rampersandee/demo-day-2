// GLOBALS
let userButton = document.getElementById('user-button');
let userZipcode = document.getElementById("user-zipcode").innerText;
let updateZipcodeButton = document.getElementById('update-zipcode')
let toggleZipcodeButton = document.getElementById('update-toggle')
let form = document.getElementById('form')
let isHidden = false
let storeNames = ['Aldi', 'Kroger', "Trader Joe's", 'Publix', 'Walmart'];
let mapboxAccessToken = 'pk.eyJ1IjoidXNlcmJqbSIsImEiOiJjbGhsOGhoNG4waGd4M2ZxeDY1N29xZjRpIn0.1_tP4tHQee4ix0d9fOd5CQ';
let trash = document.getElementsByClassName("fa-trash");

// FUNCTIONS
function mapDisplay(apiData) {

  // ZIPCODE FETCH REQUESTS
  fetch(`https://api.zippopotam.us/us/${userZipcode}`)
    .then(response => response.json())
    .then(zipData => {
      console.log(zipData, 'ZIP');
      let userLat = zipData.places[0].latitude;
      let userLon = zipData.places[0].longitude;

      mapboxgl.accessToken = mapboxAccessToken;
      const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: [userLon, userLat], // starting position [lng, lat]
        zoom: 10 // starting zoom
      });

      // Add a marker for the user's location
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([userLon, userLat])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>You are here</h3>'))
        .addTo(map);

      // Add markers for store locations
      storeNames.forEach((storeName, index) => {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${storeName}.json?country=US&proximity=${userLon},${userLat}&access_token=${mapboxAccessToken}`;
        fetch(geocodeUrl)
          .then(response => response.json())
          .then(storeData => {
            console.log(storeData, 'LOCATION');
            const storeLocations = storeData.features.slice(0, 3);

            // Iterate over each store location
            storeLocations.forEach(storeLocation => {

              // Extract the store coordinates
              const storeLon = storeLocation.center[0];
              const storeLat = storeLocation.center[1];

              // Add a marker for the store
              const marker = new mapboxgl.Marker()
                .setLngLat([storeLon, storeLat])
                .setPopup(new mapboxgl.Popup().setHTML(`<h3>${storeName}</h3><p>Enter a product in the search bar to begin</p>`))
                .addTo(map);
              if (!apiData)
              {
                return
              }
              // Get the corresponding store data
              const store = apiData[index];
              const product = store.product;
              const price = store.price;
              const weight = store.weight;
              const comment = store.comment;

              // Converting store longitude and latitude to an address
              const reverseGeo = `https://api.mapbox.com/geocoding/v5/mapbox.places/${storeLon},${storeLat}.json?access_token=${mapboxAccessToken}`
              fetch(reverseGeo)
                .then(response => response.json())
                .then(reverseData => {
                  console.log(reverseData, 'REVERSE')
                  const storeAddress = reverseData.features[0].place_name
                  const locationFavorited = favoritesArray.find(f => f.name === storeAddress) ? true : false
                  if (locationFavorited) {
                    marker.getElement().style.color = 'gold';
                    console.log(marker.getElement(), "FAVORITE")
                  }

                  // Create a popup for the marker
                  const popup = new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`<h3>${storeName}</h3><p>Product: ${product}</p><p>Price: $${price}</p><p>Weight: ${weight}</p><p>Comment: ${comment}</p><form action='/favorites' method= 'POST'>
              <input name='name' type='hidden' class='favorites' value="${storeAddress}">
              <p>${storeAddress}</p>
              <button type="submit" id='favorites-button'>Add to Favorites</button>
            </form>`);

                  // Add the popup to the marker
                  marker.setPopup(popup);

                  // Show popup on marker hover
                  marker.on('mouseover', () => {
                    marker.togglePopup();
                  });

                  // Hide popup when not hovering over marker
                  marker.on('mouseout', () => {
                    marker.togglePopup();
                  });

                  popup.on('domready', () => {
                    const favoriteButton = document.querySelector('.favorite-btn');

                    favoriteButton.addEventListener('click', () => {
                      // Change marker color to gold
                      mapboxgl.Marker({ color: 'gold' })

                      // Save the favorite choice to MongoDB
                      saveFavorite(storeName); // Call the function to save the favorite choice
                    });
                  });
                });
            })


          })
          .catch(error => {
            console.error('Error:', error);
          });
      });
    })
    .catch(error => console.error(error));
}

function productSearch() {

  // VARIABLES
  let userInput = document.getElementById('user-input').value;
  userInput = userInput.replace(/\//g, '%2F')
  console.log(userInput)
  // STORES FETCH
  fetch(`/api/${userInput}`)
    .then((res) => res.json())
    .then((productData) => {
      console.log(productData, 'USER SEARCH');
      const storeData = productData;
      mapDisplay(storeData);
    });
}

function autocomplete(inp, arr) { // Sourced from https://www.w3schools.com/howto/howto_js_autocomplete.asp 
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a, b, i, val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) { return false; }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
          (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
      increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) { //up
      /*If the arrow UP key is pressed,
      decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function setupAutocomplete() {
  // VARIABLES
  let input = document.getElementById('user-input');
  let datalist = document.getElementById('autocomplete-options');
  let autocompleteData = new Set();

  // Fetch the product data
  fetch('/api/allData')
    .then((res) => res.json())
    .then((productData) => {
      // Extract unique product names from the fetched data and add them to the Set
      for (const storeData of Object.values(productData)) {
        for (const product of storeData) {
          autocompleteData.add(product.product);
        }
      }
      console.log(autocompleteData, 'AUTO')
      autocomplete(input, Array.from(autocompleteData)); autocomplete(input, Array.from(autocompleteData));
      // input.addEventListener('input', () => {
      //   const inputValue = input.value.toLowerCase();
      //   console.log(inputValue, 'INPUT');

      //   // Filter product matches based on user input
      //   const matches = Array.from(autocompleteData).filter((product) =>
      //     product.toLowerCase().includes(inputValue)
      //   );

      //   // Clear existing options in the datalist
      //   while (datalist.firstChild) {
      //     datalist.removeChild(datalist.firstChild);
      //   }

      //   // Add filtered options to the datalist
      //   matches.forEach((match) => {
      //     const optionElement = document.createElement('option');
      //     optionElement.value = match;
      //     datalist.appendChild(optionElement);
      //   });
      // });
    })
    .catch((error) => console.error('Error:', error));
}

function addFavorite(storeName) {
  const data = { storeName };

  fetch('/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function updateZipcode(e) {
  const id = e.target.dataset.id
  const newZipcode = document.getElementById('new-zipcode').value
  console.log(newZipcode)
  fetch('/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      newZipcode
    })
  })
  window.location.reload();
}

function toggleZipcode() {
  isHidden = !isHidden
  if (isHidden) {
    console.log('HIDDEN')
    form.style.display = 'none'
  }
  else {
    console.log('NOT HIDDEN')
    form.style.display = 'block'
  }
}

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function (e) {
    const _id = e.target.dataset.id;
    fetch('/favorites', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id
      })
    }).then(function (response) {
      if (response.ok) {
        // Reload the page after successful deletion
        window.location.reload();
      } else {
        // Handle the error case
        console.error('Failed to delete favorite:', response.statusText);
      }
    }).catch(function (error) {
      console.error('Error:', error);
    });
  });
});

// FUNCTION CALLS
mapDisplay();
setupAutocomplete();
toggleZipcode()

// BUTTONS
userButton.addEventListener('click', productSearch);
updateZipcodeButton.addEventListener('click', updateZipcode)
toggleZipcodeButton.addEventListener('click', toggleZipcode)