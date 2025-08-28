let models = [], URLS = [];
let CTS = 128, CTN = 'medium', GN = '';
const TS = { small: 64, medium: 128, big: 256 };
const $canvas = $('#canvas');
const ctx = $canvas[0].getContext('2d');

const gifts = [{
  "name": "Astral Shard", "count": 50
},
{
  "name": "B-Day Candle", "count": 100,
},
{
  "name": "Berry Box", "count": 70,
},
{
  "name": "Big Year", "count": 55,
},
{
  "name": "Bonded Ring", "count": 50,
},
{
  "name": "Bow Tie", "count": 50,
},
{
  "name": "Bunny Muffin", "count": 100,
},
{
  "name": "Candy Cane", "count": 50,
},
{
  "name": "Cookie Heart", "count": 100,
},
{
  "name": "Crystal Ball", "count": 55,
},
{
  "name": "Cupid Charm", "count": 50,
},
{
  "name": "Desk Calendar", "count": 100,
},
{
  "name": "Diamond Ring", "count": 100,
},
{
  "name": "Durov's Cap", "count": 55,
},
{
  "name": "Easter Egg", "count": 62,
},
{
  "name": "Electric Skull", "count": 50,
},
{
  "name": "Eternal Candle", "count": 80,
},
{
  "name": "Eternal Rose", "count": 50,
},
{
  "name": "Evil Eye", "count": 50,
},
{
  "name": "Flying Broom", "count": 50,
},
{
  "name": "Gem Signet", "count": 50,
},
{
  "name": "Genie Lamp", "count": 49,
},
{
  "name": "Ginger Cookie", "count": 100,
},
{
  "name": "Hanging Star", "count": 100,
},
{
  "name": "Heart Locket", "count": 60,
},
{
  "name": "Heroic Helmet", "count": 50,
},
{
  "name": "Hex Pot", "count": 80,
},
{
  "name": "Holiday Drink", "count": 50,
},
{
  "name": "Homemade Cake", "count": 100,
},
{
  "name": "Hypno Lollipop", "count": 100,
},
{
  "name": "Ion Gem", "count": 56,
},
{
  "name": "Ionic Dryer", "count": 50,
},
{
  "name": "Jack-in-the-Box", "count": 58,
},
{
  "name": "Jelly Bunny", "count": 99,
},
{
  "name": "Jester Hat", "count": 100,
},
{
  "name": "Jingle Bells", "count": 100,
},
{
  "name": "Jolly Chimp", "count": 50,
},
{
  "name": "Joyful Bundle", "count": 50,
},
{
  "name": "Kissed Frog", "count": 50,
},
{
  "name": "Light Sword", "count": 52,
},
{
  "name": "Lol Pop", "count": 100,
},
{
  "name": "Loot Bag", "count": 80,
},
{
  "name": "Love Candle", "count": 50,
},
{
  "name": "Love Potion", "count": 70,
},
{
  "name": "Low Rider", "count": 50,
},
{
  "name": "Lunar Snake", "count": 100,
},
{
  "name": "Lush Bouquet", "count": 50,
},
{
  "name": "Mad Pumpkin", "count": 50,
},
{
  "name": "Magic Potion", "count": 50,
},
{
  "name": "Mini Oscar", "count": 100,
},
{
  "name": "Moon Pendant", "count": 50,
},
{
  "name": "Nail Bracelet", "count": 50,
},
{
  "name": "Neko Helmet", "count": 60,
},
{
  "name": "Party Sparkler", "count": 100,
},
{
  "name": "Perfume Bottle", "count": 50,
},
{
  "name": "Pet Snake", "count": 60,
},
{
  "name": "Plush Pepe", "count": 50,
},
{
  "name": "Precious Peach", "count": 80,
},
{
  "name": "Record Player", "count": 100,
},
{
  "name": "Restless Jar", "count": 50,
},
{
  "name": "Sakura Flower", "count": 100,
},
{
  "name": "Santa Hat", "count": 70,
},
{
  "name": "Scared Cat", "count": 50,
},
{
  "name": "Sharp Tongue", "count": 50,
},
{
  "name": "Signet Ring", "count": 50,
},
{
  "name": "Skull Flower", "count": 50,
},
{
  "name": "Sleigh Bell", "count": 50,
},
{
  "name": "Snake Box", "count": 70,
},
{
  "name": "Snow Globe", "count": 50,
},
{
  "name": "Snow Mittens", "count": 100,
},
{
  "name": "Snoop Cigar", "count": 50,
},
{
  "name": "Snoop Dogg", "count": 50,
},
{
  "name": "Spiced Wine", "count": 100,
},
{
  "name": "Spy Agaric", "count": 80,
},
{
  "name": "Star Notepad", "count": 100,
},
{
  "name": "Stellar Rocket", "count": 50,
},
{
  "name": "Swiss Watch", "count": 50,
},
{
  "name": "Swag Bag", "count": 50,
},
{
  "name": "Tama Gadget", "count": 90,
},
{
  "name": "Top Hat", "count": 70,
},
{
  "name": "Toy Bear", "count": 70,
},
{
  "name": "Trapped Heart", "count": 50,
},
{
  "name": "Valentine Box", "count": 50,
},
{
  "name": "Vintage Cigar", "count": 55,
},
{
  "name": "Voodoo Doll", "count": 50,
},
{
  "name": "Westside Sign", "count": 50,
},
{
  "name": "Whip Cupcake", "count": 50,
},
{
  "name": "Winter Wreath", "count": 70,
},
{
  "name": "Witch Hat", "count": 100,
},
{
  "name": "Xmas Stocking", "count": 65,
}]

function generateGiftList() {
  const $ul = $('#giftList').empty();
  $.each(gifts, (index, gift) => {
    $li().text(gift.name).on('click', () => {
      GN = gift;
      fetchModels();
    }) [src] (`<span>${gift.count}</span`) [to] ($ul);
  });
}

$(generateGiftList);

var url = `https://cdn.changes.tg/gifts/models/`;
async function fetchModels(type = false) {
  try {
    const response = await $.ajax({ url: `${url}${encodeURIComponent(GN)}/models.json`, dataType: 'json' });

    models = response.map(model => ({ ...model, name: model.name }));
    const baseUrl = `${url}${encodeURIComponent(GN)}/png/`;
    URLS = models.map(model => {
      const name = type ? model.name.replace(/[’`]/g, "'").replace(/\//g, "\\") : model.name;
      return `${baseUrl}${encodeURIComponent(name)}.png`;
    });

    updateCanvas();
  } catch (error) {
    console.error("fetchModels", error);
    alert('Не удалось загрузить модели, выберите название подарка.');
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