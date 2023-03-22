// console.log("kaise hai sab log");

// const API_KEY = "54d2329b2cd679314d3f6b93c04daaf3";

// function renderWeatherInfo(data) {
//       // To show data on UI
//       let newPara = document.createElement('p');
//       newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`

//       document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails() {

//   try {
//     let city = "mumbai";

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
  
//     const data = await response.json();
//     console.log("Weather data:-> ", data);


//      renderWeatherInfo(data);
//   }
//   catch(e) {
//    console.log("error detected" , error);
//   }

// }

// async function getCustomWeatherDetails() {
//   try{
//     let latitude = 15.6333;
//     let longitude = 18.3333;
  
//     const result = await  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
//     const data = await  result.json();
//     console.log(data); 
//   }
//   catch(err) {
//     console.log("error found" , err);
//   }

// }


// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


// initally variables neened??    

let oldTab = userTab;
const API_KEY = "54d2329b2cd679314d3f6b93c04daaf3";
oldTab.classList.add("current-tab");

function switchTab(newTab) {
  if(newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")) {
      //kya search form wala container is visible, if yes then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
    else {
      //main phele se search wale tab per tha, ab your weather tab visibe karana hai
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
      //for coordinates, if we haved saved them there.
      getfromsessionstorage();
    }

  }

}


userTab.addEventListener('click', () =>{
  // pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener('click', () =>{
  // pass clicked tab as input parameter
    switchTab(searchTab);
});

//check if cordinates are already present in session storage

function getfromsessionstorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if(!localCoordinates) {
     //agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
  }
  else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const {lat, lon} = coordinates;
  //make grant container incisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API CALL
  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch (e) {
    loadingScreen.classList.remove("active");
    //HW
  }
}

function renderWeatherInfo(weatherInfo) {
  //firstly, we have to fetch the elements

  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from weatherINfo object and put it UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;


}

function getLocation() {
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
      //HW - show an alert for no gelolocation support available
  }
}

function showPosition(position) {

  const userCoordinates = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
  }

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);

}

const searchInput = document.querySelector("[data-searchInput]");

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if(cityName === "")
      return;
  else 
      fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
      const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
      const data = await response.json();
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");
      renderWeatherInfo(data);
  }
  catch(err) {
      //hW
  }
}