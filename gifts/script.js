let gifts, isAscending = false;
$.get('list.json', function (data) {
  gifts = data;
  generateGiftList();
}).fail(err => console.error('Ошибка:', err));

function generateGiftList() {
  const $ul = $('#giftList').empty();
  gifts.forEach((gift, i) => {
    var $lit = $li();
    $lit[src](`${createTileImage(i)}
              <p><span class="giftname">${gift.name}</span>
              <span class="mcount">${gift.id} TOTAL:<span>${gift.count}</span> IS:${gift.supply}</span>
              <a class="giftaddress" target="_blank" href="https://getgems.io/collection/${gift.address}">${gift.address}</a></p>`);
    $lit.find('.giftaddress').click(e => e.stopPropagation());

    $lit.on('click', () => {
      const encodedData = encodeURIComponent(gift.name);
      window.location.href = `/tilesheet/?gift=${encodedData}`;
    });
    $lit[src](`<span class="giftid">${i + 1}</span`)[to]($ul);
  });
}

function createTileImage(i) {
  const col = (i % 8) * 64, row = Math.floor(i / 8) * 64;
  return `<img width="64" height="64" style="object-fit:none; transform:scale(0.5); object-position:-${col}px -${row}px;" src="/tilesheet/gifts.png">`;
}


$(document).ready(function () {
  $('#filterInput').on('input', function () {
    const filterValue = $(this).val().toLowerCase();
    $('#giftList li').each(function () {
      $(this).toggle($(this).text().toLowerCase().includes(filterValue));
    });
  });

  const $tabs = $('<div class="tabs">').prependTo('.page');

  $('<p>', { class: 'tab', text: 'Все' }).click(() => filterList('all')).appendTo($tabs);

  [49, 50, 52, 55, 56, 58, 60, 62, 65, 70, 80, 90, 99, 100]
    .forEach(count => 
      $('<p>', { class: 'tab', text: count })
      .click(() => filterList(count)).appendTo($tabs));

  $('#az-za-list-sort-button').click(() => {
    const $list = $('#giftList');
    const $items = $('ul li span.giftname').get().sort((a, b) => {
      const [textA, textB] = [a.textContent, b.textContent].map(t => t.toLowerCase());
      return isAscending ? textA.localeCompare(textB) : textB.localeCompare(textA);
    });
    $list.empty().append($items.map(item => $(item).parent().parent()));
    isAscending = !isAscending;
    $('#az-za-list-sort-button').text(isAscending ? "A-Z" : "Z-A");
  });
});

function filterList(count) {
  $('#filterInput').val('');
  const $items = $('ul li p span.mcount span');
  if (count === 'all') $items.parent().parent().parent().show();
  else {
    $items.each(function () {
      const itemCount = parseInt($(this).text());
      $(this).parent().parent().parent().toggle(itemCount === count);
    });
  }
}