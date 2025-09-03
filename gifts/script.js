let models = [], URLS = [];
var gifts;
$.get('list.json', function(data) {
  gifts = data;
  $(generateGiftList);
}).fail(function(error) {
    console.error('Ошибка:', error);
});

function generateGiftList() {
  const $ul = $('#giftList').empty();
  $.each(gifts, (index, gift) => {
    var $lit = $li();
    $lit[src]($createTileImage(index));
    $lit[src](`<p><span class="giftname">${gift.name}</span>
                  <span class="giftid">${gift.id} #${index += 1}</span></p>`);

    $lit.on('click', () => {
            const encodedData = encodeURIComponent(gift.name);
            window.location.href = `/tilesheet/?gift=${encodedData}`;
    });
    $lit[src](`<span class="mcount">${gift.count}</span`)[to]($ul);
  });
}

function $createTileImage(tileIndex) {
  const pos = Math.floor(tileIndex * 64 / 512);
  const col = tileIndex % 8 * 64;
  const row = pos * 64;
  const $img = $(`<img width="64" height="64" style="object-fit:none; transform:scale(0.5); object-position:-${col}px -${row}px; height=32px; width=32px;" src="/tilesheet/gifts.png">`);
  return $img;
}


$(document).ready(function () {
  $('#filterInput').on('input', function () {
    const filterValue = $(this).val().toLowerCase();
    $('#giftList li').each(function () {
      const giftText = $(this).text().toLowerCase();
      $(this).toggle(giftText.includes(filterValue));
    });
  });
});

const counts = [49, 50, 52, 55, 56, 58, 60, 62, 65, 70, 80, 90, 99, 100];

const $buttonContainer = $('<div class="tabs">');

$('<p>', {  class:'tab', text: 'All', click: () => filterList('all')}).appendTo($buttonContainer);

counts.forEach(count => {
  $('<p>', { class:'tab', text: `${count}`, click: () => filterList(count)}).appendTo($buttonContainer);
});

$('body').prepend($buttonContainer);

function filterList(count) {
  const $items = $('ul li span.mcount');
  if (count === 'all') $items.parent().show();
  else {
    $items.each(function() {
      const itemCount = parseInt($(this).text());
      $(this).parent().toggle(itemCount === count);
    });
  }
}