'use strict';

var TOTAL_OFFERS = 8;
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var userNum = ['01', '02', '03', '04', '05', '06', '07', '08'];

var mainForm = document.querySelector('.ad-form');
var fieldsets = mainForm.querySelectorAll('fieldset');

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

var mapPins = document.querySelector('.map__pins');
var similarPin = document.querySelector('template').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();


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
var renderCards = function (card) {
  var cardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var cardElement = cardTemplate.cloneNode(true);
  var features = cardElement.querySelector('.popup__features');
  var photos = cardElement.querySelector('.popup__photos');
  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getFlatType(card.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  features.innerHTML = '';
  cardElement.querySelector('.popup__features').appendChild(renderFeatures());
  photos.innerHTML = '';
  cardElement.querySelector('.popup__photos').appendChild(renderPhotos());
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;
  return cardElement;
};

var showCard = function (card) {
  var offerFragment = document.createDocumentFragment();
  var beforeBlock = document.querySelector('.map__filters-container');
  offerFragment.appendChild(renderCards(card));
  document.querySelector('.map').insertBefore(offerFragment, beforeBlock);
};

// Отрисовка метки
var renderPins = function (pins) {
  var pinElement = similarPin.cloneNode(true);
  var pinImg = pinElement.querySelector('img');
  pinElement.style.top = pins.location.y + 'px';
  pinElement.style.left = pins.location.x + 'px';
  pinImg.src = pins.author.avatar;
  fragment.appendChild(pinElement);
  pinElement.addEventListener('click', function () {
    if (document.querySelector('.map__card')) {
      closeCards();
    }
    showCard(pins);
    var closeCardBtn = document.querySelector('.popup__close');
    closeCardBtn.addEventListener('click', function () {
      closeCards();
    });
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) {
        document.querySelector('.map').removeChild(document.querySelector('.map__card'));
      }
    });
  });
  mapPins.appendChild(fragment);
};

var closeCards = function () {
  var popup = document.querySelector('.map__card');
  if (popup) {
    document.querySelector('.map').removeChild(document.querySelector('.map__card'));
  }
};

// module4-task1 ==========================================================================================

// Деактивируем форму
// var disabledForm = function () {
for (i = 0; i < fieldsets.length; i++) {
  fieldsets[i].setAttribute('disabled', 'disabled');
}
// };

// активируем форму
var activatedForm = function () {
  document.querySelector('.map').classList.remove('map--faded');
  mainForm.classList.remove('ad-form--disabled');
  for (i = 0; i < fieldsets.length; i++) {
    fieldsets[i].removeAttribute('disabled', 'disabled');
  }
};

var pinMain = document.querySelector('.map__pin--main');
var PIN_WIDTH = pinMain.clientWidth;
var PIN_HEIGHT = pinMain.clientHeight;
var MAP_HEIGHT = 750;
var MAP_WIDTH = 1200;

// Расчет координат метки
// var setAddress = function () {
  var pinCoordX = Math.floor(MAP_WIDTH / 2 - PIN_WIDTH / 2);
  var pinCoordY = Math.floor(MAP_HEIGHT / 2 - PIN_HEIGHT / 2);
  document.querySelector('#address').value = pinCoordX + ', ' + pinCoordY;
// };
pinMain.addEventListener('mouseup', function () {
  activatedForm();
  // setAddress();
  for (i = 0; i < TOTAL_OFFERS; i++) {
    renderPins(offers[i]);
  }
});


// module4-task2 ==========================================================================================

// Зависимость цены за ночь от типа
var typeRoom = mainForm.elements.type;
var priceRoom = mainForm.elements.price;

typeRoom.addEventListener('change', function () {
  switch (typeRoom.value) {
    case 'bungalo':
      priceRoom.min = 0;
      priceRoom.placeholder = 'от 0';
      break;

    case 'flat':
      priceRoom.min = 1000;
      priceRoom.placeholder = 'от 1000';
      break;

    case 'house':
      priceRoom.min = 5000;
      priceRoom.placeholder = 'от 5000';
      break;

    case 'palace':
      priceRoom.min = 10000;
      priceRoom.placeholder = 'от 10000';
  }
});

// Синхронизация времени заезда и выезда
var timeIn = mainForm.elements.timein;
var timeOut = mainForm.elements.timeout;

var timeInOut = function (e) {
  var target = e.target;
  timeIn.value = target.value;
  timeOut.value = target.value;
};

var timeEl = mainForm.querySelector('.ad-form__element--time');
timeEl.addEventListener('change', timeInOut);

// Синхронизация количества комнат и гостей

var roomNum = mainForm.elements.rooms;
var guestCount = mainForm.elements.capacity;
var checkRoomGuest = function () {

  var roomValue = mainForm.elements.rooms.options[roomNum.selectedIndex].value;

  var guestValue = mainForm.elements.capacity.options[guestCount.selectedIndex].value;
  if (roomValue === '1' && guestValue !== '1') {
    guestCount.setCustomValidity('Только для 1 гостя');
  } else if (roomValue === '2' && guestValue !== '1' && guestValue !== '2') {
    guestCount.setCustomValidity('Только для 1 или 2 гостей');
  } else if (roomValue === '3' && guestValue !== '1' && guestValue !== '2' && guestValue !== '3') {
    guestCount.setCustomValidity('Только для 1, 2 или 3 гостей');
  } else if (roomValue === '100') {
    guestCount.setCustomValidity('Не для гостей');
  } else {
    guestCount.setCustomValidity('');
  }
};


roomNum.addEventListener('change', checkRoomGuest);
guestCount.addEventListener('change', checkRoomGuest);

// module5-task1 ==========================================================================================


// клик по метке

pinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var LEFT_EDGE_MAP = 0;
  var RIGHT_EDGE_MAP = 1200;
  var TOP_EDGE_MAP = 0;
  var BOTTOM_EDGE_MAP = 704;

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };


  var onPinMainMousemove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var pinMainX = pinMain.offsetLeft - shift.x;
    var pinMainY = pinMain.offsetTop - shift.y;

    if (pinMainX < LEFT_EDGE_MAP) {
      pinMain.style.left = '0px';
    } else if (pinMainX >= RIGHT_EDGE_MAP - 62) {
      pinMain.style.left = '1138px';
    } else {
      pinMain.style.left = pinMainX + 'px';
    }


    if (pinMainY < TOP_EDGE_MAP) {
      pinMain.style.top = '0px';
    } else if (pinMainY >= BOTTOM_EDGE_MAP - 84) {
      pinMain.style.top = '620px';
    } else {
      pinMain.style.top = pinMainY + 'px';
    }
    document.querySelector('#address').value = (pinMainX + 6) + ', ' + (pinMainY + 10);
  };

  var onPinMainMouseup = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener('mousemove', onPinMainMousemove);
    document.removeEventListener('mouseup', onPinMainMouseup);
  };

  document.addEventListener('mousemove', onPinMainMousemove);
  document.addEventListener('mouseup', onPinMainMouseup);


});


// pinMain.addEventListener('mouseup', onPinMainMouseup);
