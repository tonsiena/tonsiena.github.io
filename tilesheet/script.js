let models = [], URLS = [];
let CTS = 128, CTN = 'medium', GN = '';
const TS = { small: 64, medium: 128, big: 256 };
var $canvas, ctx, url = `https://cdn.changes.tg/gifts/models/`;
async function fetchModels(type = false) {
  try {
    const response = await $.ajax({ url: `${url}${encodeURIComponent(GN)}/models.json`, dataType: 'json' });

    models = response
      .map(model => ({ ...model, name: model.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const baseUrl = `${url}${encodeURIComponent(GN)}/png/`;
    URLS = models.map(model => {
      const name = type ? model.name.replace(/[’`]/g, "'").replace(/\//g, "\\") : model.name;
      return `${baseUrl}${encodeURIComponent(name)}.png`;
    });

    $("body").empty()[src](
      `<div class="page">
        <canvas id="canvas"></canvas>
        <p class="warning">Если некоторые тайлы отображаются серыми
            <span onclick="fetchModels(true)">нажмите сюда</span>
        </p>
       <p class="options">
            <span onclick="setTileSize('small')">64px</span>
            <span onclick="setTileSize('medium')">128px</span>
            <span onclick="setTileSize('big')">256px</span>
            <span onclick="saveImage()">Скачать</span>
        </p>
    </div>`
    )
    $canvas = $('#canvas');
    ctx = $canvas[0].getContext('2d');

    updateCanvas();
  } catch (error) {
    console.error("fetchModels", error);
    $("body").empty()[src](`<p class='empty'>Ошибка при получении названия подарка</p>`)
  }
}

function setTileSize(sizeName) {
  CTN = sizeName;
  CTS = TS[sizeName];
  updateCanvas();
}

function updateCanvas() {
  if (!URLS.length) return console.warn('Список моделей пуст');

  $canvas.attr({ width: 8 * CTS, height: Math.ceil(URLS.length / 8) * CTS });
  ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);

  createTilemap();
  $('html, body').animate({ scrollTop: 0 }, 500);
}

function createTilemap() {
  let loadedImages = 0;
  $.each(URLS, (index, url) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    var x = (index % 8) * CTS;
    var y = Math.floor(index / 8) * CTS;
    img.onload = () => ctx.drawImage(img, x, y, CTS, CTS);

    img.onerror = () => {
      console.error(`Не удалось загрузить изображение: ${url}`);
      ctx.fillStyle = 'gray';
      ctx.fillRect(x, y, CTS, CTS);
      loadedImages++;
    };
  });
}

function saveImage() {
  if (!GN) return alert('Сперва создайте тайлсет!');

  $('<a>').attr({
    download: `${GN}_${CTN}.png`,
    href: $canvas[0].toDataURL('image/png')
  })[0].click();
}


$(document).ready(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const data = urlParams.get('gift');
  if (data) {
    GN = decodeURIComponent(data);
    fetchModels();
  } else $("body").empty()[src](`<p class='empty'>Ошибка при получении названия подарка</p>`)
})