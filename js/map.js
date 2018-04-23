'use strict';

var TOTAL_OFFERS = 8;
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var userNum = ['01', '02', '03', '04', '05', '06', '07', '08'];

// генерация случайного числа из диапазона
function getRandomRangeNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// генерация случайного числа
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// массив случайной длины
var getRandomLengthArray = function (array) {
  return array.slice(0, getRandomRangeNum(1, array.length));
};

// случайное неповторяющееся значение
var getRandomNum = function (array) {
  var randomIndex = Math.floor(Math.random() * (array.length));
  var randomNum = array[randomIndex];
  array.splice(randomIndex, 1);
  return randomNum;
};

// перемешать массив
var getRandomArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var offers = [];
var renderOffers = function () {
  var locationX = getRandomRangeNum(300, 900);
  var locationY = getRandomRangeNum(150, 500);
  return {
    author: {
      avatar: 'img/avatars/user' + getRandomNum(userNum) + '.png'
    },
    offer: {
      title: getRandomNum(TITLE),
      address: locationX + ', ' + locationY,
      price: getRandomRangeNum(1000, 1000000),
      type: getRandomItem(TYPE),
      rooms: getRandomRangeNum(1, 5),
      guests: getRandomRangeNum(1, 10),
      checkin: getRandomItem(CHECK_TIME),
      checkout: getRandomItem(CHECK_TIME),
      features: getRandomArray(getRandomLengthArray(FEATURES)),
      description: '',
      photos: getRandomArray(PHOTOS)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

for (var i = 0; i < TOTAL_OFFERS; i++) {
  offers.push(renderOffers());
}

var getFlatType = function (type) {
  var flatType;
  if (type === 'flat') {
    flatType = 'Квартира';
  } else if (type === 'bungalo') {
    flatType = 'Бунгало';
  } else if (type === 'house') {
    flatType = 'Дом';
  } else if (type === 'palace') {
    flatType = 'Дворец';
  }
  return flatType;
};


// Отрисовка метки
var renderPins = function (pins) {
  var mapPins = document.querySelector('.map__pins');
  var similarPin = document.querySelector('template').content.querySelector('.map__pin');
  var fragment = document.createDocumentFragment();

  for (i = 0; i < TOTAL_OFFERS; i++) {
    var pinElement = similarPin.cloneNode(true);
    var pinImg = pinElement.querySelector('img');
    pinElement.style.top = pins[i].location.y + 'px';
    pinElement.style.left = pins[i].location.x + 'px';
    pinImg.src = pins[i].author.avatar;
    fragment.appendChild(pinElement);
  }
  mapPins.appendChild(fragment);
};

// отрисовываем метки на карте
renderPins(offers);

// удобства
var renderFeatures = function () {
  var fragmentF = document.createDocumentFragment();
  for (var f = 0; f < offers[0].offer.features.length; f++) {
    var li = document.createElement('li');
    li.className = 'popup__feature popup__feature--' + offers[0].offer.features[f];
    fragmentF.appendChild(li);
  }
  return fragmentF;
};

// фото
var renderPhotos = function () {
  var fragmentP = document.createDocumentFragment();
  for (var p = 0; p < offers[0].offer.photos.length; p++) {
    var img = document.createElement('img');
    img.className = 'popup__photo';
    img.src = offers[0].offer.photos[p];
    img.style.width = '45px';
    img.style.height = '40px';
    img.alt = 'Фотография жилья';
    fragmentP.appendChild(img);
  }
  return fragmentP;
};

// Отрисовка объявления
var renderCards = function () {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  var features = cardElement.querySelector('.popup__features');
  var photos = cardElement.querySelector('.popup__photos');
  cardElement.querySelector('.popup__title').textContent = offers[0].offer.title;
  cardElement.querySelector('.popup__text--address').textContent = offers[0].offer.address;
  cardElement.querySelector('.popup__text--price').textContent = offers[0].offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getFlatType(offers[0].offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = offers[0].offer.rooms + ' комнаты для ' + offers[0].offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + offers[0].offer.checkin + ', выезд до ' + offers[0].offer.checkout;
  cardElement.querySelector('.popup__description').textContent = offers[0].offer.description;
  features.innerHTML = '';
  cardElement.querySelector('.popup__features').appendChild(renderFeatures());
  photos.innerHTML = '';
  cardElement.querySelector('.popup__photos').appendChild(renderPhotos());
  cardElement.querySelector('.popup__avatar').src = offers[0].author.avatar;
  return cardElement;
};

var showCard = function () {
  var offerFragment = document.createDocumentFragment();
  var beforeBlock = document.querySelector('.map__filters-container');
  offerFragment.appendChild(renderCards(offers));
  document.querySelector('.map').insertBefore(offerFragment, beforeBlock);

};

showCard(offers);

document.querySelector('.map').classList.remove('map--faded');
