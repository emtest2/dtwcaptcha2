function checkSmileysCAPTCHA2() {
    var res = "";
    // iterate smileys
    for (var i = 0; i < 15; ++i){
        if (i >0)
            res += " "
        res += getCodeFromDict(i);
    }
    $('#test1').append("<br/>Result: "+res)
}

function addLog(txt){
    //$('#test1').append("<br/>"+txt)
    return -1;
}

function getCodeFromDict(smileyNum){
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
    var img = document.getElementById("cipher");
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
        if (null == img)
            return addLog("error loading dictionary image ("+i+")...");
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