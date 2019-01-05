function resize() {
    var designwidth = 750;
    var designFontsize = 200;
    var windowwidth = document.documentElement.offsetWidth;
    let fontsize = windowwidth / (designwidth / designFontsize);
    document.documentElement.style.fontSize = fontsize + 'px';
}
resize();
window.addEventListener('resize',resize)