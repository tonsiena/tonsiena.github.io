export const CardBuilder = {
     parseData: (item, alt = "") => CardBuilder.data?.[item] || alt,
     parseExtra: (item, alt = "") => CardBuilder.data?.extra?.[item] || alt,
     cardHeader: () => {
        return $('<div>').addClass('card-header').append(
               $('<p>').addClass('card-header-text').text(CardBuilder.parseData("name")).append(
               $('<span>').addClass('detail-description').text(CardBuilder.parseData("description"))),
               $('<img>').attr({
                src: CardBuilder.parseExtra("_image_small", "../nopic.png"),
                loading: 'lazy', onerror: "this.src='../nopic.png'"
               }));
     },
     cardAddress:() => {
        return $('<a>').addClass('detail-address')
                .attr('href', `https://${CardBuilder.testnet == 1 ? "testnet." : "" }tonscan.org/collection/${new TonWeb.Address(CardBuilder.address).toString(true, true, false, false)}`)
                .text(CardBuilder.address);
     },
     cardDetail:(key, value) => {
       return value ? $('<p>').addClass('detail').append(
                $('<span>').addClass('detail-key').text(key),
                $('<span>').addClass('detail-val').text(value)) : null
     },
     cardFooter:() => {
        return $('<div>').addClass('card-footer').append(
               CardBuilder.cardDetail("Image", CardBuilder.data?.image),
               CardBuilder.cardDetail("Domain", CardBuilder.data?.extra?.image),
               CardBuilder.cardDetail("External link", CardBuilder.data?.extra?.external_link),
               CardBuilder.cardDetail("External url", CardBuilder.data?.extra?.external_uri),
               CardBuilder.cardDetail("Cover image", CardBuilder.data?.extra?.cover_image),
               CardBuilder.cardDetail("Uri", CardBuilder.data?.extra?.uri));
     },
    cardExpand: () => {
        if(!CardBuilder.minimized){
        var $cardexpand =  $('<p>').addClass('detail-expand').text('expand');
        $cardexpand.on('click', () => {
            const $cardcontent = $cardexpand.siblings(".card-content");
            $cardcontent.toggleClass("expanded");
            $cardexpand.text($cardcontent.hasClass("expanded") ? "minimize" : "expand");
        });
        return $cardexpand;
    }
    },
    card: () => {
        var $card;
        if (CardBuilder.data?.valid) {
            var className = "card-content"
            if(CardBuilder.minimized === 1) className += " expanded";
            $card = $('<li>').addClass('card').append(
                $('<div>').addClass(className)
                    .append(CardBuilder.cardHeader(),
                        CardBuilder.cardAddress(),
                        CardBuilder.cardFooter()),
                CardBuilder.cardExpand());
        } else {
            $card = $('<li>').addClass('card').append(
                $('<div>').addClass('card-header').append(CardBuilder.cardAddress(),
                    $('<img>').attr({
                        src: CardBuilder.parseExtra("_image_small", "../nopic.png"),
                        loading: 'lazy', onerror: "this.src='../nopic.png'"
                    })));
        }
        $card.appendTo(CardBuilder.target);

        return $card;
    },
    build:(address, data, target, testnet, minimized) => {
           CardBuilder.address = address;
           CardBuilder.data = data;
           CardBuilder.target = target;
           CardBuilder.testnet = testnet;
           CardBuilder.minimized = minimized;
    return CardBuilder.card();
    }
}
