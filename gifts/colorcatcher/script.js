$(() => {
const canvas = $('#canvas')[0];
    const ctx = canvas.getContext('2d');
    const img = new Image();
    let mode = 'edgeColor', data, loaded = false;

    $.get('data.json').done(d => data = d);

    $('#imageUpload').change(({target: {files}}) => {
        if (!files[0]) return;
        img.src = URL.createObjectURL(files[0]);
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            drawImage();
            $('#output').text('');
            URL.revokeObjectURL(img.src);
            loaded = true;
        };
    });

    $('#edgeMode').click(() => $('#edgeMode').text(mode = mode === 'edgeColor' ? 'centerColor' : 'edgeColor'));

    $(canvas).mousedown(({offsetX: x, offsetY: y}) => {
        if(!loaded) return;
        const {data: [r, g, b]} = ctx.getImageData(x, y, 1, 1);
        const hex = rgbToHex(r, g, b);
        const match = findClosestMatch({r, g, b});
        const dist = colorDistance({r, g, b}, hexToRgb(match.hex[mode]));
        $('#output').html(`Цвет выбран: ${hex} <br><br> ${dist < 50 ? `Ближайший цвет: ${match.name}` : 'No close match'} <span class="color-swatch" style="background-color:${match.hex[mode]}"></span>`);
    });

    const drawImage = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };

    const colorDistance = (c1, c2) => Math.sqrt((c1.r - c2.r) ** 2 + (c1.g - c2.g) ** 2 + (c1.b - c2.b) ** 2);

    function findClosestMatch(rgb) {
        let minDist = Infinity, closest = data[0];
        data.forEach(d => {
            const dist = colorDistance(rgb, hexToRgb(d.hex[mode]));
            if (dist < minDist) {
                minDist = dist;
                closest = d;
            }
        });
        return closest;
    }
});