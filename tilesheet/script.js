let models = [], URLS = [];
let CTS = 128, CTN = 'medium', GN = '';
const TS = { small: 64, medium: 128, big: 256 };
const $canvas = $('#canvas');
const ctx = $canvas[0].getContext('2d');

const gifts = [
  "Astral Shard", "B-Day Candle", "Berry Box", "Big Year", "Bonded Ring",
  "Bow Tie", "Bunny Muffin", "Candy Cane", "Cookie Heart", "Crystal Ball",
  "Cupid Charm", "Desk Calendar", "Diamond Ring", "Durov's Cap", "Easter Egg",
  "Electric Skull", "Eternal Candle", "Eternal Rose", "Evil Eye", "Flying Broom",
  "Gem Signet", "Genie Lamp", "Ginger Cookie", "Hanging Star", "Heart Locket",
  "Heroic Helmet", "Hex Pot", "Holiday Drink", "Homemade Cake", "Hypno Lollipop",
  "Ion Gem", "Ionic Dryer", "Jack-in-the-Box", "Jelly Bunny", "Jester Hat",
  "Jingle Bells", "Jolly Chimp", "Joyful Bundle", "Kissed Frog", "Light Sword",
  "Lol Pop", "Loot Bag", "Love Candle", "Love Potion", "Low Rider", "Lunar Snake",
  "Lush Bouquet", "Mad Pumpkin", "Magic Potion", "Mini Oscar", "Moon Pendant",
  "Nail Bracelet", "Neko Helmet", "Party Sparkler", "Perfume Bottle", "Pet Snake",
  "Plush Pepe", "Precious Peach", "Record Player", "Restless Jar", "Sakura Flower",
  "Santa Hat", "Scared Cat", "Sharp Tongue", "Signet Ring", "Skull Flower",
  "Sleigh Bell", "Snake Box", "Snow Globe", "Snow Mittens", "Snoop Cigar",
  "Snoop Dogg", "Spiced Wine", "Spy Agaric", "Star Notepad", "Stellar Rocket",
  "Swiss Watch", "Swag Bag", "Tama Gadget", "Top Hat", "Toy Bear",
  "Trapped Heart", "Valentine Box", "Vintage Cigar", "Voodoo Doll",
  "Westside Sign", "Whip Cupcake", "Winter Wreath", "Witch Hat", "Xmas Stocking"
]

function generateGiftList() {
  const $ul = $('#giftList').empty();
  $.each(gifts, (index, gift) => {
    $li().text(gift).on('click', () => {
      GN = gift;
      fetchModels();
    }) [to] ($ul);
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