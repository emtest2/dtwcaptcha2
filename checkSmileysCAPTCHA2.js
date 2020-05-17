function checkSmileysCAPTCHA2(srcImg) {
    //init payload
    $(document.body).append(
        `<div id=dictionary style="display:none;">
            <span>Dict:</span><br/>
            <img id="dict_1" src="happy.bmp"><br/>
            <img id="dict_2" src="smiley4.bmp"><br/>
            <img id="dict_3" src="smiley7.bmp"><br/>
            <img id="dict_4" src="wink.bmp"><br/>
            <img id="dict_5" src="BG.bmp"><br/>
            <img id="dict_6" src="angry.bmp"><br/>
            <img id="dict_7" src="smiley3.bmp"><br/>
            <img id="dict_8" src="smiley5.bmp"><br/>
            <img id="dict_9" src="smiley6.bmp"><br/>
            <img id="dict_10" src="meh.bmp"><br/>
            <img id="dict_11" src="smiley2.bmp"><br/>
            <img id="dict_12" src="smiley1.bmp"><br/>
            <br/>
            <img id="remoteDict_1" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/happy.bmp"><br/>
            <img id="remoteDict_2" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/smiley4.bmp"><br/>
            <img id="remoteDict_3" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/smiley7.bmp"><br/>
            <img id="remoteDict_4" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/wink.bmp"><br/>
            <img id="remoteDict_5" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/BG.bmp"><br/>
            <img id="remoteDict_6" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/angry.bmp"><br/>
            <img id="remoteDict_7" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/smiley3.bmp"><br/>
            <img id="remoteDict_8" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/smiley5.bmp"><br/>
            <img id="remoteDict_9" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/smiley6.bmp"><br/>
            <img id="remoteDict_10" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/meh.bmp"><br/>
            <img id="remoteDict_11" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/smiley2.bmp"><br/>
            <img id="remoteDict_12" src="https://cdn.jsdelivr.net/gh/emtest2/dtwcaptcha2/smiley1.bmp"><br/>
            <br/>
            <img alt='CAPTCHA' src="Example2.bmp"><br/>
            <img id="smiley1" src="smiley1.bmp"><br/>
            <img id="smiley1b" src="smiley1b.bmp"><br/>
            <img id="smiley2" src="smiley2.bmp"><br/>
            <img id="smiley3" src="smiley3.bmp"><br/>
        </div>
        <div id=test1></div>
        <span>Canvas1 (cipher):</span><br/>
        <canvas id=canvas1></canvas><br/>
        <span>Compare:</span><br/>
        <canvas id=canvas2></canvas><br/>
        <span>To:</span><br/>
        <canvas id=canvas3></canvas><br/>
        <span>Diff:</span><br/>
        <canvas id=canvas4></canvas><br/>`);

    // delay to finish loading
    setTimeout("parseCaptcha()", 300);
}

function parseCaptcha(){
    //captcha
    var srcImg = $("img[alt='CAPTCHA']")[0];

    // parse
    var res = "";
    // iterate smileys
    for (var i = 0; i < 15; ++i){
        if (i >0)
            res += " "
        res += getCodeFromDict(i, srcImg);
    }
    //$('#test1').append("<br/>Result: "+res)
    debugger
    $("#answer").val(res);
    //$(".form--captcha-1").submit();
}

function addLog(txt){
    //$('#test1').append("<br/>"+txt)
    return -1;
}

function getCodeFromDict(smileyNum, srcImg){
    const width = 26;
    const height = 27;
    const threshold = 10;
    const srcOffsetX = 4 + smileyNum * width; //horizontal
    const srcOffsetY = 6; //vertical
    
    var dictList = ["happy.bmp", "smiley4.bmp", "smiley7.bmp", "wink.bmp", "BG.bmp", "angry.bmp", "smiley3.bmp", "smiley5.bmp", "smiley6.bmp", "meh.bmp", "smiley2.bmp", "smiley1.bmp"];
    var codeList = [":)", ":p", ":(", ";)", "B)", ":@", ":o", ":s", ":|", ":/", "<3", ":D"];
    if (dictList.length != codeList.length){                
        alert("Lists error")
        return
    }

    // source img
    var img = srcImg;//document.getElementById("cipher");
    var ctxSnippet = canvas2.getContext("2d");
    ctxSnippet.drawImage(img, srcOffsetX, srcOffsetY, width, height, 0, 0, width, height);
    const ctxSnippetImg = ctxSnippet.getImageData(0, 0, width, height);
    var dictContext = canvas3.getContext("2d");

    // compare canvas
    var diffContext = canvas4.getContext("2d")
    const diff = diffContext.createImageData(width, height);

    // iterate dictionary
    for (var i = 0; i < dictList.length; ++i){
        // load dict image
        addLog("load dictionary ("+i+" - "+dictList[i]+")...");
        var img = document.getElementById("dict_"+(i+1));
        //var img = document.getElementById("remoteDict_"+(i+1));
        if (null == img)
            return addLog("error loading dictionary image ("+i+")...");
        //img.crossOrigin = ''; // not working for CORS
        dictContext.drawImage(img, 0, 0);
        const dictContextImg = dictContext.getImageData(0, 0, width, height);

        // check differences
        var nbDiff = pixelmatch(ctxSnippetImg.data, dictContextImg.data, diff.data, width, height, {threshold: 0.1});
        addLog("nbDiff ("+i+"): "+nbDiff);
        if (nbDiff < threshold) {
            addLog("match ("+i+"): "+codeList[i]);
            return codeList[i];
        }
    }
    return "UNKNOWN";
}