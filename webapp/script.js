// Инициализация Eruda для отладки
eruda.init();

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand(); // Полноэкранный режим

$(document).ready(function () {
  // Показать начальное окно
  $('#main-screen').show();
  $('#second-screen').hide();

  // Переход на второе окно
  $('#go-to-second').click(function () {
    $('#main-screen').hide();
    $('#second-screen').show();
    tg.MainButton.hide(); // Скрыть основную кнопку Telegram, если не нужна
  });

  // Возврат на главное окно
  $('#go-back').click(function () {
    $('#second-screen').hide();
    $('#main-screen').show();
  });

  // Настройка кнопки "Назад" Telegram
  tg.BackButton.onClick(function () {
    if ($('#second-screen').is(':visible')) {
      $('#second-screen').hide();
      $('#main-screen').show();
      tg.BackButton.hide();
    }
  });

  // Показать кнопку "Назад", если на втором экране
  $('#second-screen').is(':visible') ? tg.BackButton.show() : tg.BackButton.hide();
});
