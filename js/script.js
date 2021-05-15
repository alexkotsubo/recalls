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
	let choseBrand = null;
	let choseModel = null;

	const selectBrand = $('.header__tabs-brand').select2({
		ajax: {
			url: 'https://alexkotsubo.github.io/recalls/src/brands.json', // Сюда ставим URL где лежат наши данные, их пример в файле brands.json (удалите его когда сделаете свои запросы)
			dataType: 'json',
			type: 'GET',
			processResults: function (data) {
			// Подгружаем марки
				return {
					results: $.map(data.brands, function(brand) {
						return {
							text: brand.name,
							id: brand.name.toLowerCase()
						};
					})
				};
			}
		},
		placeholder: "Choose Car Brand",
		allowClear: true,
	});

	const selectModel = $('.header__tabs-model').select2({
		ajax: {
			url: 'https://alexkotsubo.github.io/recalls/src/brands.json', // Сюда ставим URL где лежат наши данные, их пример в файле brands.json (удалите его когда сделаете свои запросы)
			dataType: 'json',
			type: 'GET',
			processResults: function (data) {
				// Подгружаем модели, в соответствии с выбранной маркой
				if (choseBrand) {
					const brandModels = $.map(data.brands, brand => {
						if (brand.name.toLowerCase() === choseBrand.toLowerCase()) return brand.models;
					});
					return {
						results: $.map(brandModels, function(model) {
							return {
								text: model.model,
								id: model.model.toLowerCase()
							};
						})
					};
				}
			}
		},
		placeholder: "Choose Model",
		allowClear: true,
	});

	const selectYear = $('.header__tabs-year').select2({
		placeholder: "Choose Year",
		allowClear: true,
		ajax: {
			url: 'https://alexkotsubo.github.io/recalls/src/brands.json', // Сюда ставим URL где лежат наши данные, их пример в файле brands.json (удалите его когда сделаете свои запросы)
			dataType: 'json',
			type: 'GET',
			processResults: function (data) {
				// Подгружаем года, в соответствии с выбранной моделью
				if (choseModel) {
					const modelsYears = $.map(data.brands, brand => {
						if (brand.name.toLowerCase() === choseBrand.toLowerCase()) {
							return $.map(brand.models, model => {
								if (model.model.toLowerCase() === choseModel.toLowerCase()) return model.years;
							});
						};
					});
					return {
						results: $.map(modelsYears, function(year) {
							return {
								text: year,
								id: year.toLowerCase()
							};
						})
					};
				}
			}
		}
	});

	selectBrand.on('change', function(e) {
		if (selectBrand.val()) {
			choseBrand = selectBrand.val();
			// Включаем возможность выбрать модель когда выбрана марка
			selectModel.prop("disabled", false);
		} else {
			choseBrand = null;
			// Читстим поля
			selectModel.val(null).trigger('change');
			selectYear.val(null).trigger('change');
			// Отключаем возможность выбрать модель и год если не выбрана марка
			selectModel.prop("disabled", true);
			selectYear.prop("disabled", true);
		}
	});

	selectModel.on('change', function(e) {
		if (selectBrand.val()) {
			if (selectModel.val()) {
				choseModel = selectModel.val();
				// Включаем возможность выбрать год когда выбрана модель
				selectYear.prop("disabled", false);
			} else {
				choseModel = null;
				// Читстим поле
				selectYear.val(null).trigger('change');
				// Отключаем возможность выбрать год когда не выбрана модель
				selectYear.prop("disabled", true);
			}
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