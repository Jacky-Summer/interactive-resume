~function(window){
    let winW = document.documentElement.clientWidth,
        deviceW = 640;
    function computedREM(){
        if (winW >= 640) {
            document.documentElement.style.fontSize = '100px';
            return;
        }
        document.documentElement.style.fontSize = winW / deviceW * 100 + 'px';
    }
    computedREM();
    window.addEventListener('resize',computedREM);
}(window);