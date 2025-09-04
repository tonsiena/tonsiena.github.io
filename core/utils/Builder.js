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
    },
    rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join(''),
    hexToRgb = (hex) => {
        const n = parseInt(hex.slice(1), 16);
        return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }