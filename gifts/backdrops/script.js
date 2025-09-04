$(document).ready(function () {
    $.getJSON('https://cdn.changes.tg/gifts/backdrops.json')
        .done(data => {
            $('#backdropTableBody').empty();
            $.each(data, (i, backdrop) => {
                $('#backdropTableBody').append(`
                            <tr>
                                <td class="name">#${backdrop.backdropId} ${backdrop.name}</td>
                                <td><span class="color-circle" style="background-color: ${backdrop.hex.centerColor};"></span>${backdrop.hex.centerColor}</td>
                                <td><span class="color-circle" style="background-color: ${backdrop.hex.edgeColor};"></span>${backdrop.hex.edgeColor}</td>
                                <td><span class="color-circle" style="background-color: ${backdrop.hex.patternColor};"></span>${backdrop.hex.patternColor}</td>
                                <td><span class="color-circle" style="background-color: ${backdrop.hex.textColor};"></span>${backdrop.hex.textColor}</td>
                            </tr>
                        `);
            });
        })
        .fail(() => {
            $('#backdropTableBody').html('<tr><td colspan="5">Не удалось получить данные</td></tr>');
        });

    $('#filterInput').on('keyup', function () {
        let input = $(this).val().toLowerCase();
        $('#backdropTableBody tr').each(function () {
            let name = $(this).find('.name').text().toLowerCase();
            $(this).toggle(name.includes(input));
        });
    });

    $('#backdropTable').on('click', 'td', function () {
        let text = $(this).text().trim();
        navigator.clipboard.writeText(text).then(() => {
            $('<div>', { text: `Скопировано: ${text}`, class: 'toast' })
                .appendTo('body')
                .animate({ opacity: 1 }, 300)
                .delay(2000)
                .animate({ opacity: 0 }, 300, function () { $(this).remove(); });
        }).catch(err => console.error('Ошибка при копировании:', err));
    });
});