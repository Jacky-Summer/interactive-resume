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
            phoneRender.init();
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

let phoneRender = (function(){
    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('h3'),
        $answer = $('.answer'),
        $markMove = $('.markMove'),
        $answerMarkLink = $answer.find('.markLink'),
        $hang = $('.hang'),
        $hangMarkLink = $('.hang').find('.markLink'),
        answerBell = $('#answerBell')[0],
        introduction = $('#introBell')[0];

    
    //=>点击ANSWER-MARK
    let answerMarkTouch = function answerMarkTouch() {
        //1.REMOVE ANSWER
        $answer.remove();
        answerBell.pause();
        $(answerBell).remove();//=>一定要先暂停播放然后再移除，否则即使移除了浏览器也会播放着这个声音

        //2.SHOW HANG
        $hang.css('transform', 'translateY(0rem)');
        $time.css('display', 'block');
        introduction.play();
        computedTime();
    }

    //=>计算播放时间
    let autoTimer = null;
    let computedTime = function computedTime() {
        autoTimer = setInterval(() => {
            let val = introduction.currentTime,
                duration = introduction.duration;
                console.log(val,duration)
            //播放完成  
            if(val >= duration){
                clearInterval(autoTimer);
                closePhone();
                return;
            }

            let minute = Math.floor(val / 60),
                second = Math.floor(val - minute * 60);
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            $time.html(`${minute}:${second}`);

        }, 1000);
    }

    //=>关闭PHONE
    let closePhone = function closePhone() {
        clearInterval(autoTimer);
        introduction.pause();
        $(introduction).remove();
        $phoneBox.remove();

        messageRender.init();
    };

    return {
        init:function(){
            $phoneBox.css('display', 'block');
             //=>播放BELL
            answerBell.play();
            answerBell.volume = 0.3;

            $answerMarkLink.tap(answerMarkTouch);
            $hangMarkLink.tap(closePhone);
        }
    }
})();

let messageRender = (function(){
    let $messageBox = $('.messageBox'),
    $wrapper = $messageBox.find('.wrapper'),
    $messageList = $wrapper.find('li'),
    $keyBoard = $messageBox.find('.keyBoard'),
    $textInp = $keyBoard.find('span'),
    $submit = $keyBoard.find('.submit'),
    demonMusic = $('#demonMusic')[0];

    let step = -1,
        total = $messageList.length + 1,
        autoTimer = null,
        interval = 2000;

    let tt = 0;
    let showMessage = function showMessage(){
    
        ++step;
        if(step === 2){
            clearTimeout(autoTimer);
            handleSend();
            return;
        }
        let $cur = $messageList.eq(step).addClass('active');  
        
        if(step >=3){
            //=>展示的条数已经是四条或者四条以上了,此时让WRAPPER向上移动(移动的距离是新展示这一条的高度)
            let curH = $cur[0].offsetHeight;
            tt -= curH;
            $wrapper.css('transform', `translateY(${tt}px)`);
        }

        if (step >= total - 1) {
            //=>展示完了
            clearInterval(autoTimer);
            closeMessage();
        }
    };

    let handleSend = function handleSend(){
        $keyBoard.css('transform','translateY(0)');
        let str = '好的,马上介绍!';
        let n = -1;
            strLength = str.length,
            timer = null;
        timer = setInterval(() => {
            let orginHTML = $textInp.html();
            $textInp.html(orginHTML + str[++n]);
            if( n >= strLength - 1){
                clearInterval(timer);
                $submit.css('display','block');
            }
        },100);  
    }

    //=>点击SUBMIT
    let handleSubmit = function handleSubmit() {
        $(`<li class="self">
        <i class="arrow"></i>
        <img src="./images/zf_messageStudent.png" alt="" class="pic">
        ${$textInp.html()}</li>`).insertAfter($messageList.eq(1)).addClass('active');

        $messageList = $wrapper.find('li');
        $submit.css('display','none');
        $keyBoard.css('transform','translateY(3.7rem)');

        $textInp.html('');

        //=>继续向下展示剩余的消息
        autoTimer = setInterval(showMessage, interval);
        
    }

    let closeMessage = function closeMessage(){
        let delayTimer = setTimeout(() => {
            demonMusic.pause();
            $(demonMusic).remove();
            $messageBox.remove();
            clearTimeout(delayTimer);

            cubeRender.init();
        }, interval);
    }

    return {
        init:function(){
            $messageBox.css('display','block');

            showMessage();
            autoTimer = setInterval(showMessage,interval);

            //=>SUBMIT
            $submit.tap(handleSubmit);

            demonMusic.volume = 0.3;
            demonMusic.play();

        }
    }
})();

let cubeRender = (function(){
    return {
        init:function(){
            $('.cubeBox').css('display','block');
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
    case 'messageBox':
        messageRender.init();
        break;
    case 'cube':
        cubeRender.init();
        break;
    default:
        loadingRender.init();

}