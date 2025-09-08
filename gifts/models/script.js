$(document).ready(function () {

  $.getJSON('/gifts/giftsizes.json')
    .done(function (json) {
      const $giftList = $('#giftList');
      $giftList.empty();

      $.each(json, function (_, obj) {
        const giftName = Object.keys(obj)[0];
        const $link = $('<a>')
          .attr('href', `?gift=${encodeURIComponent(giftName)}`)
          .text(giftName);
        $giftList.append($link);
      });

      const params = new URLSearchParams(window.location.search);
      const giftParam = params.get('gift');

      const $container = $('#tableContainer');
      const $message = $('#message');

      if (!giftParam) {
        $message.text("Параметр 'gift' не указан в ссылке");
        $container.empty();
        return;
      }

      const giftObj = json.find(obj => Object.keys(obj)[0] === giftParam);
      if (!giftObj) {
        $message.text(`Подарок '${giftParam}' не найден в базе данных\n\nВы можете выбрать подарок нажав на кнопку слева`);
        $container.empty();
        return;
      }

      $message.text("");

      const [giftName, children] = Object.entries(giftObj)[0];
      const items = Object.entries(children).map(([modelName, size]) => ({ modelName, size }));

      let rowsHtml = '';
      $.each(items, function (_, item) {
        rowsHtml += `<tr><td>${item.modelName}</td><td>${item.size}</td></tr>`;
      });

      const tableHtml = `
        <table>
          <thead>
            <tr><th colspan="2">${giftName}</th></tr>
            <tr><th>Модель</th><th>Байты</th></tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      `;

      $container.html(tableHtml);
    })
    .fail(function () {
      $('#message').text('Ошибка загрузки файла');
      $('#tableContainer').empty();
    });
  function toggleMenu() {
    const $sidebar = $('#sidebar');
    $sidebar.toggleClass('active');
  }

  $(".menu-toggle").on('click', () => toggleMenu());

  $(document).on('click', function (event) {
    const sidebar = document.querySelector('#sidebar');
    const menuToggle = document.querySelector('.menu-toggle');

    if (sidebar.classList.contains('active')) {
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);

      if (!isClickInsideSidebar && !isClickOnToggle) {
        sidebar.classList.remove('active');
      }
    }
  });
});