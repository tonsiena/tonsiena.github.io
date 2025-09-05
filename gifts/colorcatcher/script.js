$(() => {
    const canvas = $('#canvas')[0];
    const ctx = canvas.getContext('2d');
    const img = new Image();
    let pickColor = false;
    let mode = 'edgeColor', data, loaded = false;

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

    $('#colorPicker').click(() => {
       $('#colorPicker').toggleClass("active");
       pickColor = !pickColor;
    });


    $('#imageUpload').click(() => $("#Upload").click());

    $(canvas).on('mousedown touchstart', (e) => {
        if (!loaded) return;
        if (!pickColor) return;
        let x = e.offsetX, y = e.offsetY;
        if (e.type === 'touchstart') {
            const touch = e.originalEvent.touches[0];
            const rect = canvas.getBoundingClientRect();
            x = touch.clientX - rect.left;
            y = touch.clientY - rect.top;
        }

        if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;

        const { data: [r, g, b] } = ctx.getImageData(x, y, 1, 1);
        const hex = rgbToHex(r, g, b);
        const match = findClosestMatch({ r, g, b });
        const dist = colorDistance({ r, g, b }, hexToRgb(match.hex[mode]));
        drawImage(x, y);
        $('#output').html(`Цвет выбран: ${hex} <br><br> ${dist < 50 ? `Ближайший цвет: ${match.name}` : 'No close match'} <span class="color-swatch" style="background-color:${match.hex[mode]}"></span>`);
    });

    const drawImage = (mx, my, width = 396, height = 396) => {
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (mx && my) {
            ctx.beginPath();
            ctx.arc(mx, my, 4, 0, Math.PI * 2);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }   
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