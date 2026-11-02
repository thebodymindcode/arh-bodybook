/* Цель Метрики «Нажал купить» (идентификатор KUPIT, цель 625283238). 19.09.2026.
   Общий файл для страниц продуктов: один обработчик ловит клик по любой ссылке
   на payform.ru, в том числе по ссылкам, которые скрипт страницы подставил позже.
   В параметры цели уходят: продукт (og:title страницы), текст кнопки, код ссылки
   Продамуса (по нему видно тариф) и адрес страницы.
   Переход на оплату НЕ задерживается и не трогается: Метрика отправляет цель через
   sendBeacon, такой запрос браузер доносит и после ухода со страницы (проверено
   19.09.2026 в отладочном браузере: цель ушла типом Ping и засчиталась в отчёте).
   Цель означает намерение, а не оплату: сама оплата идёт на стороне Продамуса.
   Подключение: <script src="/cel-kupit.js?v=20260919" defer></script> перед </body>.
   На /shop/ стоит свой встроенный обработчик той же цели, туда этот файл не ставить. */
(function () {
  'use strict';
  if (window.__celKupit) return;
  window.__celKupit = true;
  var SCHETCHIK = 111871994;

  function chistyj(s, n) {
    return String(s || '').replace(/\s+/g, ' ').trim().slice(0, n || 80);
  }

  function produkt() {
    var og = document.querySelector('meta[property="og:title"]');
    var imya = og && og.getAttribute('content');
    if (!imya) {
      var h1 = document.querySelector('h1');
      imya = h1 ? h1.textContent : document.title;
    }
    return chistyj(imya, 80);
  }

  document.addEventListener('click', function (e) {
    try {
      var a = e.target && e.target.closest ? e.target.closest('a[href*="payform.ru"]') : null;
      if (!a || typeof window.ym !== 'function') return;
      var kod = (a.getAttribute('href') || '').replace(/^https?:\/\/(www\.)?payform\.ru\/?/, '').replace(/\/.*$/, '');
      window.ym(SCHETCHIK, 'reachGoal', 'KUPIT', {
        tovar: produkt(),
        knopka: chistyj(a.textContent, 60),
        ssylka: kod,
        stranica: location.pathname
      });
    } catch (x) { /* цель не должна ломать кнопку оплаты */ }
  }, true);
})();
