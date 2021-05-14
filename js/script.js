'use strict';

/* IB */

function ib() {
	let ib = document.querySelectorAll(".ib");
	for (let i = 0; i < ib.length; i++) {
		if (ib[i].querySelector('.ib_use')) {
			ib[i].style.backgroundImage = 'url(' + ib[i].querySelector('.ib_use').getAttribute('src') + ')';
		}
	}
}

ib();

/* Selects */

$(document).ready(function() {
	const selectBrand = $('.header__tabs-brand').select2({
		placeholder: "Choose Car Brand",
		allowClear: true,
	});

	const selectModel = $('.header__tabs-model').select2({
		placeholder: "Choose Model",
		allowClear: true,
	});

	const selectYear = $('.header__tabs-year').select2({
		placeholder: "Choose Year",
		allowClear: true,
	});

	selectBrand.on('change', function(e) {
		if (selectBrand.val()) {
			// Скорее всего, здесь нужно подгружать модели и года, конечно же в соответствии с выбранной маркой

			// Включаем возможность выбрать модель или год когда выбрана марка
			selectModel.prop("disabled", false);
			selectYear.prop("disabled", false);
		} else {
			// Отключаем возможность выбрать модель или год если не выбрана марка
			selectModel.prop("disabled", true);
			selectYear.prop("disabled", true);
		}
	});

	// Чистим поля (на странице бренда, бренда-модели и бренда-модели-года нужно подставлять вместо null значения которые выбрал пользователь)
	selectBrand.val(null).trigger('change');
	selectModel.val(null).trigger('change');
	selectYear.val(null).trigger('change');

	/* Tabs */

	const tabsContainer = document.querySelector('.header__tabs');
	const tabsBtns = tabsContainer.querySelectorAll('.header__tabs-btn');
	const tabsTabs = tabsContainer.querySelectorAll('.header__tabs-tab');
	// Таб по умолчанию
	let prevTab = 0;

	for(let i = 0, length = tabsBtns.length; i < length; i++) {
		tabsBtns[prevTab].classList.add('active');
		tabsTabs[prevTab].classList.add('active');
		tabsTabs[i].classList.add('disabled');

		tabsBtns[i].addEventListener('click', function(e) {
			tabsBtns[prevTab].classList.remove('active');
			tabsTabs[prevTab].classList.remove('active');
			tabsBtns[i].classList.add('active');
			tabsTabs[i].classList.add('active');
			prevTab = i;
		});
	}
});

/* View All */

window.addEventListener('load', (e) => {
	const openBlocks = document.querySelectorAll('.open-block');

	for(let i = 0, length = openBlocks.length; i < length; i++) {
		const openContent = openBlocks[i].querySelector('.open-block__content');
		const openBtn = openBlocks[i].querySelector('.open-block__btn');
		// В атрибут data-start-height мы 
		// либо передаем data-start-height="колчичество рядов которое хотим показывать, елемент который является частью ряда и задаёт его высоту - например карточка, null, контейнер который оборачивает всё внутри .open-block__content"
		// либо передаем data-start-height="null, null, просто высоту которую хотим показывать - полезно в случае скрытия текста, контейнер который оборачивает всё внутри .open-block__content"
		const dataStartHeight = openContent.getAttribute('data-start-height').split(', ');
		let openWrapHeight = openBlocks[i].querySelector(dataStartHeight[3]).offsetHeight;
		let startHeight = 0;
		let opened = false;

		function calcStartHeight(e) {
			openWrapHeight = openBlocks[i].querySelector(dataStartHeight[3]).offsetHeight;
			if (dataStartHeight[2] === 'null') {
				startHeight = openBlocks[i].querySelector(dataStartHeight[1]).offsetHeight * +dataStartHeight[0];
			} else {
				startHeight = dataStartHeight[2];
			}

			if (e) {
				if (opened) {
					openContent.style.height = openWrapHeight + 'px';
				} else {
					openContent.style.height = startHeight + 'px';
				}
			}
		}

		window.addEventListener("resize", calcStartHeight);
		calcStartHeight();

		if (startHeight >= openWrapHeight) {
			openBtn.classList.add('disabled');
		} else {
			openContent.style.height = startHeight + 'px';

			openBtn.addEventListener('click', function(e) {
				if (!opened) {
					openContent.style.height = openWrapHeight + 'px';
					opened = true;
				} else {
					openContent.style.height = startHeight + 'px';
					opened = false;
				}
			});
		}
	}
});

/* Slider */

document.addEventListener('DOMContentLoaded', function(e) {
	if (document.querySelector('.recallsby-slider')) {
		const recallsbySlider = new Swiper('.recallsby-slider', {
			spaceBetween: 30,
			navigation: {
				nextEl: '.recallsby__btns-next',
				prevEl: '.recallsby__btns-prev',
			},
			breakpoints: {  
				320: {
					slidesPerView: 3,
				},
				500: {
					slidesPerView: 6,
				},
				768: {
					slidesPerView: 10,
				},
				992: {
					slidesPerView: 12,
				},
			},
		});

		const slidesNums = document.querySelectorAll('.recallsby-slider__num');
		let numbers = [];
		let theBiggestNum = 0;

		for(let i = 0, length = slidesNums.length; i < length; i++) {
			const num = slidesNums[i].innerHTML;
			numbers[i] = +num;
			if (+num > theBiggestNum) {
				theBiggestNum = +num;
			}
		}

		const chart = document.querySelectorAll('.recallsby-slider__chart');

		for(let i = 0, length = chart.length; i < length; i++) {
			chart[i].style.height = numbers[i] / theBiggestNum * 90 + 'px';
		}
	}
});

/* Gallery */

if (document.querySelector('.year__model')) {
	const swiper = new Swiper(".year__slider", {
		spaceBetween: 30,
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		breakpoints: {  
			320: {
				slidesPerView: 3,
			},
			576: {
				slidesPerView: 5,
			},
		},
	});
	const swiper2 = new Swiper(".year__slider2", {
		spaceBetween: 10,
		thumbs: {
			swiper: swiper,
		},
	});
}

/* Years Slider */

if (document.querySelector('.year__sliders')) {
	const yearsSlider = new Swiper('.years__slider', {
		navigation: {
			nextEl: '.years__btns-next',
			prevEl: '.years__btns-prev',
		},
		breakpoints: {  
			320: {
				slidesPerView: 3,
			},
			500: {
				slidesPerView: 6,
			},
			768: {
				slidesPerView: 10,
			},
			992: {
				slidesPerView: 14,
			},
			1200: {
				slidesPerView: 17,
			},
		},
	});
}