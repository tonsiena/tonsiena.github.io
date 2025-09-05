$(document).ready(function () {
    const openNewTab = (url) => window.open(url, '_blank');

    $('.list-item').click(function (e) {
        if ($(e.target).closest('a').length) return;

        var url = $(this).data('url');
        if (url) openNewTab(url);
    });
});
