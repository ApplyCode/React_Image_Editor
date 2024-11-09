export default () => {
    return {
        name: 'wrapWithFunc',
        renderChunk: function renderChunk(code) {
            return '(function () { \n' + code + '\n })()';
        }
    }
}