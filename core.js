function _0x364a(_0x37243b, _0x16c1e9) { const _0x2777b4 = _0x2777(); return _0x364a = function (_0x364a2b, _0x4b2971) { _0x364a2b = _0x364a2b - 0x1ac; let _0x296dbd = _0x2777b4[_0x364a2b]; return _0x296dbd; }, _0x364a(_0x37243b, _0x16c1e9); } function _0x2777() { const _0x5591b5 = ['528856vaMjQP', '9051559HRbqNt', '138140iOrZts', '3ptXBEA', '1406642QsQdPX', '18uCTyUc', 'json', '25syESQa', '2132148lFigkE', '260190oyQROg', 'error', 'createElement', '7uHxwxH', '1229400ozPdRb']; _0x2777 = function () { return _0x5591b5; }; return _0x2777(); } const _0x2e1d66 = _0x364a; (function (_0x167859, _0x8feea) { const _0x432fee = _0x364a, _0x32f020 = _0x167859(); while (!![]) { try { const _0x5c2d20 = parseInt(_0x432fee(0x1b2)) / 0x1 + -parseInt(_0x432fee(0x1ad)) / 0x2 * (-parseInt(_0x432fee(0x1ac)) / 0x3) + parseInt(_0x432fee(0x1b9)) / 0x4 * (parseInt(_0x432fee(0x1b0)) / 0x5) + parseInt(_0x432fee(0x1b1)) / 0x6 * (parseInt(_0x432fee(0x1b5)) / 0x7) + -parseInt(_0x432fee(0x1b7)) / 0x8 * (parseInt(_0x432fee(0x1ae)) / 0x9) + -parseInt(_0x432fee(0x1b6)) / 0xa + -parseInt(_0x432fee(0x1b8)) / 0xb; if (_0x5c2d20 === _0x8feea) break; else _0x32f020['push'](_0x32f020['shift']()); } catch (_0x139a8a) { _0x32f020['push'](_0x32f020['shift']()); } } }(_0x2777, 0x64f51)); export const cfetch = async _0x3fcbb2 => { const _0x52097b = _0x364a; try { const _0x34aac2 = await fetch(_0x3fcbb2); return await _0x34aac2[_0x52097b(0x1af)](); } catch (_0x176ca7) { console[_0x52097b(0x1b3)]('fetchAccount:', _0x3fcbb2, _0x176ca7); } }; export const e3 = _0x3f6d03 => document[_0x2e1d66(0x1b4)](_0x3f6d03); export const q5 = _0xb86e2b => document['querySelector'](_0xb86e2b);

export const fetchAccount = async (address) => {
    if(address.length != 0) return await cfetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(address)}`);
};


export const Builder = {
    display: (view, type) => {
        if (view && view.style) view.style.display = type;
    },
    add: (el, props, parrent) => {
        var item = Object.assign(document.createElement(el), props);
        parrent?.append(item);
        return item;
    },
    details: (key, value, parent, href = value) => {
        if (value) {
            var details = Builder.add("p", { className: "dt" }, parent)
            Builder.add("span", { className: "dt-sp-key", textContent: key }, details)
            Builder.add("a", { className: "dt-sp-val", href: href, target: "_blank", textContent: value }, details)
            return details;
        }
    }
}