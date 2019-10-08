/* loading */
let loadingRender = (function(){
    let $loadingBox = $('.loadingBox'),
        $current = $loadingBox.find('.cur');
    
    let imgData = ["images/zf_concatAddress.png","images/zf_concatPhone.png","images/zf_course1.png","images/zf_course2.png","images/zf_course3.png","images/zf_course4.png","images/zf_course5.png","images/zf_course6.png",
        "images/zf_messageArrow1.png","images/zf_messageArrow2.png","images/zf_messageChat.png","images/zf_messageKeyboard.png","images/zf_phoneBg.jpg",
        "images/zf_phoneDetail.png","images/zf_phoneListen.png","images/zf_return.png"
    ];

    //=>RUN:预加载图片的
    let n = 0,
        len = imgData.length;
    let run = function run(callback){
        imgData.forEach(item => {
            let tempImg = new Image;
            tempImg.onload = function(){
                tempImg = null;
                $current.css('width', (++n) / len * 100 + '%');

                //=>加载完成:执行回调函数(让当前LOADING页面消失)
                if(n === len){
                    clearTimeout(delayTimer);
                    callback && callback();
                } 
            }
            tempImg.src = item;
        });
    };
    //=>MAX-DELAY:设置最长等待时间（假设10S，到达10S我们看加载多少了，如果已经达到了90%以上，我们可以正常访问内容了，如果不足这个比例，直接提示用户当前网络状况不佳，稍后重试）
    let delayTimer = null;
    let maxDelay = function maxDelay(callback){
        delayTimer = setTimeout(()=>{
            clearTimeout(delayTimer);
            if(n / len >= 0.9){
                $current.css('width','100%');
                callback && callback();
                return;
            }
            alert('很遗憾，当前网络不佳，请稍后再试！');
        },10000);
    }

    //=>DONE 完成
    let done = function done(){
        //=>停留一秒钟再移除进入下一环节
        let timer = setTimeout(() => {
            $loadingBox.remove();
            clearTimeout(timer);
        },1000);
    }

    return {
        init: function () {
            $loadingBox.css('display', 'block');
            run(done);
            maxDelay(done);
        }
    }
})();

/*HASH*/
let url = window.location.href, 
    well = url.indexOf('#'),
    hash = well === -1 ? null : url.substr(well + 1);

switch (hash) {
    case 'loading':
        loadingRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    default:
        loadingRender.init();
}