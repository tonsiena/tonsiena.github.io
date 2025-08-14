$(document).ready(() => {
    initTelegramWebApp(false);
    $content(
            $p("siena-title", "tonsiena"),
            $a(origin + "/nft", "nft").addClass("span-redirect")
        );
});