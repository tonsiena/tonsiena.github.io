$(document).ready(function () {
    const openNewTab = (url) => window.open(url, '_blank');

    $('.list-item').click(function () {
        var url = $(this).data('url');
        if (url) openNewTab(url);
    });
});