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
    $lit[src](`<span class="giftname">${gift.name}</span>`);
    $lit.on('click', () => {
            const encodedData = encodeURIComponent(gift.name);
            window.location.href = `/tilesheet/?gift=${encodedData}`;
    });
    $lit[src](`<span>${gift.count}</span`)[to]($ul);
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

