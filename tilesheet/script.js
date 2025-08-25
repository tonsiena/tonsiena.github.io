var $ = jQuery;
let models = [], imageUrls = [];
let currentTileSize = 64, currentSizeName = 'small', giftName = '';
const tileSizes = { small: 64, medium: 128, big: 256 };
const $canvas = $('#canvas');
const ctx = $canvas[0].getContext('2d');

const gifts = [
  "Santa Hat", "Signet Ring", "Precious Peach", "Plush Pepe", "Spiced Wine",
  "Jelly Bunny", "Durov's Cap", "Perfume Bottle", "Eternal Rose", "Berry Box",
  "Vintage Cigar", "Magic Potion", "Kissed Frog", "Hex Pot", "Evil Eye",
  "Sharp Tongue", "Trapped Heart", "Skull Flower", "Scared Cat", "Spy Agaric",
  "Homemade Cake", "Genie Lamp", "Lunar Snake", "Party Sparkler", "Jester Hat",
  "Witch Hat", "Hanging Star", "Love Candle", "Cookie Heart", "Desk Calendar",
  "Jingle Bells", "Snow Mittens", "Voodoo Doll", "Mad Pumpkin", "Hypno Lollipop",
  "B-Day Candle", "Bunny Muffin", "Astral Shard", "Flying Broom", "Crystal Ball",
  "Eternal Candle", "Swiss Watch", "Ginger Cookie", "Mini Oscar", "Lol Pop",
  "Ion Gem", "Star Notepad", "Loot Bag", "Love Potion", "Toy Bear",
  "Diamond Ring", "Sakura Flower", "Sleigh Bell", "Top Hat", "Record Player",
  "Winter Wreath", "Snow Globe", "Electric Skull", "Tama Gadget", "Candy Cane",
  "Neko Helmet", "Jack-in-the-Box", "Easter Egg", "Bonded Ring", "Pet Snake",
  "Snake Box", "Xmas Stocking", "Big Year", "Holiday Drink", "Gem Signet",
  "Light Sword", "Restless Jar", "Nail Bracelet", "Heroic Helmet", "Bow Tie",
  "Heart Locket", "Lush Bouquet", "Whip Cupcake", "Joyful Bundle", "Cupid Charm",
  "Valentine Box", "Snoop Dogg", "Swag Bag", "Snoop Cigar", "Low Rider",
  "Westside Sign", "Stellar Rocket", "Jolly Chimp", "Moon Pendant", "Ionic Dryer"
];

function generateGiftList() {
  const $ul = $('#giftList').empty();
  $.each(gifts, (i, gift) => {
    $('<li>').text(gift).on('click', () => {
      giftName = gift;
      fetchModels();
    }).appendTo($ul);
  });
}

$(generateGiftList);

async function fetchModels(type = false) {
  try {
    const response = await $.ajax({
      url: `https://cdn.changes.tg/gifts/models/${encodeURIComponent(giftName)}/models.json`,
      dataType: 'json'
    });

    models = response.map(model => ({ ...model, name: model.name }));
    const baseUrl = `https://cdn.changes.tg/gifts/models/${encodeURIComponent(giftName)}/png/`;
    imageUrls = models.map(model => {
      const name = type ? model.name.replace(/[’`]/g, "'").replace(/\//g, "\\") : model.name;
      return `${baseUrl}${encodeURIComponent(name)}.png`;
    });

    updateCanvas();
  } catch (error) {
    console.error('Error fetching models:', error);
    alert('Failed to load models. Select gift name.');
  }
}

function setTileSize(sizeName) {
  currentSizeName = sizeName;
  currentTileSize = tileSizes[sizeName];
  updateCanvas();
}

function updateCanvas() {
  if (!imageUrls.length) {
    console.warn('Image list is empty. Load models first.');
    return;
  }

  const columns = 8;
  const rows = Math.ceil(imageUrls.length / columns);
  $canvas.attr({ width: columns * currentTileSize, height: rows * currentTileSize });
  ctx.clearRect(0, 0, $canvas[0].width, $canvas[0].height);

  createTilemap();
}

function createTilemap() {
  let loadedImages = 0;
  $.each(imageUrls, (index, url) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;

    img.onload = () => {
      const x = (index % 8) * currentTileSize;
      const y = Math.floor(index / 8) * currentTileSize;
      ctx.drawImage(img, x, y, currentTileSize, currentTileSize);

      if (++loadedImages === imageUrls.length) {
        console.log('Tilemap ready!');
      }
    };

    img.onerror = () => {
      console.error(`Failed to load image: ${url}`);
      const x = (index % 8) * currentTileSize;
      const y = Math.floor(index / 8) * currentTileSize;
      ctx.fillStyle = 'gray';
      ctx.fillRect(x, y, currentTileSize, currentTileSize);
      loadedImages++;
    };
  });
}

function saveImage() {
  if (!giftName) {
    alert('Please select a gift name before saving!');
    return;
  }
  $('<a>').attr({
    download: `${giftName}_${currentSizeName}.png`,
    href: $canvas[0].toDataURL('image/png')
  })[0].click();
}