const wrapper = document.querySelector('.wrapper'),
textInfo = wrapper.querySelector('.text-info'),
inputPart = wrapper.querySelector('.input-part'),
input = inputPart.querySelector('input'),
button = inputPart.querySelector('button'),
weatherPart = wrapper.querySelector('.weather-container .weather-part'),
locationText = weatherPart.querySelector('.location span'),
temp = weatherPart.querySelector('.temp'),
description = weatherPart.querySelector('.description'),
feels = weatherPart.querySelector('.feels .deg span'),
category = weatherPart.querySelector('.category .deg span'),
humidity = weatherPart.querySelector('.humidity .deg span'),
wind = weatherPart.querySelector('.wind .deg span'),
img = weatherPart.querySelector('img'),
backArrow = wrapper.querySelector('header i'),
apiKey = '7e30901010c097ac493ef43f8ec1fe39'; //ganti dengan API key kamu

// function requwst ke API
function requestAPI(url) {
  textInfo.classList.remove('error');
  textInfo.classList.add('pending');
  textInfo.innerHTML = "Mendapatkan lokasi...";

  fetch(url)
  .then(response => response.json())
  .then(result => weatherInfo(result));
}

// ketika user mengklik enter, maka request API
input.addEventListener('keyup', (e) => {
  if(e.key === "Enter" && input.value !== "") {
    let city = input.value;
    requestAPI(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=id&appid=${apiKey}`);
  }
});

// function untuk mengolah data hasil request ke API
function weatherInfo(data) {
//jika kota tidak ditemukan
  if(data.cod == "404") {
    textInfo.innerHTML = "Kota tidak ditemukan";
    textInfo.classList.add('error');
  } else {
    textInfo.innerHTML = "Mendapatkan lokasi...";
     textInfo.classList.add('pending');
     wrapper.classList.add('active');

    //  masukkan semua data ke info cuaca
     locationText.innerHTML = `${data.name}, ${data.sys.country}`;
     temp.innerHTML = `${Math.floor(data.main.temp)} °C`;
     description.innerHTML = data.weather[0].description;
     feels.innerHTML = Math.floor(data.main.feels_like);
     category.innerHTML = data.weather[0].main;
     humidity.innerHTML = data.main.humidity;
     wind.innerHTML = Math.floor(data.wind.speed);

     let weatherID = data.weather[0].id;

     // sesuaikan icon dengan cuaca
     //akses data.weather[0], maka tiap cuaca ada id-nya, misal id 2xx berarti badai
     //lengkapnya bisa kunjungi https://openweathermap.org/weather-conditions
    if(weatherID >= 200 && weatherID <= 232) {
      img.src = './assets/image/stormy.png';
    } else if(weatherID >= 300 && weatherID <= 321) {
      img.src = './assets/image/clouds.png';
    } else if(weatherID >= 500 && weatherID <= 531) {
      img.src = './assets/image/heavy-rain.png';
    } else if(weatherID >= 600 && weatherID <= 622) {
      img.src = './assets/image/snow.png';
    } else if(weatherID >= 701 && weatherID <= 781) {
      img.src = './assets/image/fog.png';
    } else if(weatherID === 800) {
      img.src = './assets/image/sunny.png';
    } else if(weatherID >= 801 && weatherID <= 804) {
      img.src = './assets/image/cloudy-day.png';
    }
  } 
}

// fungsi tombol back
backArrow.addEventListener('click', () => {
  wrapper.classList.remove('active');
  textInfo.innerHTML = '';
  textInfo.classList.remove('pending', 'error');
});

// dapatkan koordinat saat tombol diklik
button.addEventListener('click', () => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert('Browse anda tidak mendukung fitur ini');
  }
});

function onSuccess(position) {
  let {latitude, longitude} = position.coords;
  requestAPI(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=id&appid=${apiKey}`);
}

function onError() {
  textInfo.classList.add('error');
  textInfo.innerHTML = "Gagal mendapatkan lokasi";
}
