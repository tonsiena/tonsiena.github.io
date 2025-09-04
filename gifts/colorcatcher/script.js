$(() => {
    const canvas = $('#canvas')[0];
    const ctx = canvas.getContext('2d');
    const img = new Image();
    let mode = 'edgeColor', data, loaded = false, scale = 1, scaleStep = 0.2;

    $.get('data.json').done(d => data = d);

    $('#Upload').change(({ target: { files } }) => {
        if (!files[0]) return;
        img.src = URL.createObjectURL(files[0]);
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            drawImage();
            URL.revokeObjectURL(img.src);
            loaded = true;
        };
    });

    $('#edgeMode').click(() => $('#edgeMode').text(mode = mode === 'edgeColor' ? 'centerColor' : 'edgeColor'));
    $('#zoomIn').click(() => {
        if (!loaded) return;
        scale += scaleStep;
        drawImage();
    });

    $('#zoomOut').click(() => {
        if (!loaded) return;
        if (scale > scaleStep) {
            scale -= scaleStep;
            drawImage();
        }
    });

    $('#imageUpload').click(() => $("#Upload").click());

    $(canvas).on('mousedown touchstart', (e) => {
        if (!loaded) return;
        let x = e.offsetX, y = e.offsetY;
        if (e.type === 'touchstart') {
            const touch = e.originalEvent.touches[0];
            const rect = canvas.getBoundingClientRect();
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        }

        x = x / scale;
        y = y / scale;

        if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;

        const { data: [r, g, b] } = ctx.getImageData(x * scale, y * scale, 1, 1);
        const hex = rgbToHex(r, g, b);
        const match = findClosestMatch({ r, g, b });
        const dist = colorDistance({ r, g, b }, hexToRgb(match.hex[mode]));
        $('#output').html(`Цвет выбран: ${hex} <br><br> ${dist < 50 ? `Ближайший цвет: ${match.name}` : 'No close match'} <span class="color-swatch" style="background-color:${match.hex[mode]}"></span>`);
    });

    const drawImage = () => {
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        ctx.scale(1 / scale, 1 / scale);
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