const origin = true ? "https://tonsiena.github.io" : "http://127.0.0.1:5500",
    src = "append",
    to = "appendTo",
    $el = (selector, name, text = "", attrs = {}) =>
        $(`<${selector} ${name ? ` class="${name}"` : ""}>`).attr(attrs).text(text),
    $p = (name, text) =>
        $el("p", name, text),
    $span = (name, text) =>
        $el("span", name, text),
    $li = (name) =>
        $el("li", name),
    $div = (name, ...source) =>
        $el("div", name)[src](...source),
    $img = (name, src, alt) =>
        $el("img", name, null, { src: src || '../icons/nopic.png', alt }),
    $a = (href, text) =>
        href && $el("a", "link", text, { href: href }),
    $toast = (text) => {
        let $message = $p('toast-message', text)[to]($("#toast-container"))
        setTimeout(() => $message.remove(), 2500);
    }