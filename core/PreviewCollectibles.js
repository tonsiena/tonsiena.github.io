export const previewScreen = ($page, url, message = null) => {
    $page.empty();
    if(message) 
        $('<p>').addClass('alert-e-message').text(message).appendTo($page)
    const $previewContainer = $('<div>').addClass('pr-cn').appendTo($page);

    const $accountWrapper = $('<div>').addClass('pr-iw').appendTo($previewContainer);
    $('<label>').addClass('pr-il').text('Account').appendTo($accountWrapper);
    const $accountInput = $('<input>').addClass('pr-if').attr({
        type: 'text',placeholder: 'Enter account',
        value: url.get('account') || ''
    }).appendTo($accountWrapper);

    const $offsetWrapper = $('<div>').addClass('pr-iw').appendTo($previewContainer);
    $('<label>').addClass('pr-il').text('Offset').appendTo($offsetWrapper);
    const $offsetInput = $('<input>').addClass('pr-if').attr({
        type: 'number', placeholder: 'Enter offset',
        value: url.get('offset') || 0
    }).appendTo($offsetWrapper);

    const $limitWrapper = $('<div>').addClass('pr-iw').appendTo($previewContainer);
    $('<label>').addClass('pr-il').text('Limit').appendTo($limitWrapper);
    const $limitInput = $('<input>').addClass('pr-if').attr({
        type: 'number', placeholder: 'Enter limit',
        value: url.get('limit') || 1000
    }).appendTo($limitWrapper);

    const $collectionWrapper = $('<div>').addClass('pr-iw').appendTo($previewContainer);
    $('<label>').addClass('pr-il').text('Collection').appendTo($collectionWrapper);
    const $collectionInput = $('<input>').addClass('pr-if').attr({
        type: 'text', placeholder: 'Enter collection',
        value: url.get('collection') || ''
    }).appendTo($collectionWrapper);

    const $buttonContainer = $('<div>').addClass('pr-sr-cn').appendTo($previewContainer);
    $('<button>').addClass('pr-sr-bt').text('Search').on('click', () => {
        if ($accountInput.val()) {
            let url = `https://tonsiena.github.io/collectibles/?account=${$accountInput.val()}`;
            if ($offsetInput.val()) url += `&offset=${$offsetInput.val()}`;
            if ($limitInput.val()) url += `&limit=${$limitInput.val()}`;
            if ($collectionInput.val()) url += `&collection=${$collectionInput.val()}`;
            window.location.href = url;
        }
    }).appendTo($buttonContainer);
};