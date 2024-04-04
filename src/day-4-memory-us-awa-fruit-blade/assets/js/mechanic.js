// JavaScript Document

var stage;
var queue;
var stageWidth = gamespecs.width;
var stageHeight = gamespecs.height;

var btnIndex;
var btnList = [];

var iconIndex;
var iconList = [];

var exitIndex;
var exitList = [];
var exitFired = false;
var exitTime = 500;

var skinIndex = 0;
var skinList = [];

var cycleIndex = 0;
var cycleLiveList = [];
var cycleIsWin = false;
var winList = [];
var isMemoryGame = gamespecs.memory;

var zCycleClass = cyclespecs.zclass;
// "single" || "multi"
var cycleLoopIndex = 0;
// INDEX FOR CURRENT ICON TO SHOW IN CYCLE
var cycleLoopLength = 0;
// LENTH OF ICONS TO SHOWIN CYCLE

var userClickedList = [];

var markerIndex = 0;
var markerBmpList = [];
var markerContainerList = [];
var markerCount = markerspecs.count;

var tapIndex = 0;
var tapBmpList = [];
var tapContainerList = [];
var tapCenterX = tapspecs.x;
var tapCenterY = tapspecs.y;
var tapPauseOut = tapspecs.pauseout;

var tapCount = tapspecs.count;

var tapWrapperList = [];
var tapWrapOffset = tapspecs.offset;

var sceneIndex = 0;
var sceneMax = (gamespecs.scenecount - 1);

var scoreIndex = 0;
var scoreMin = gamespecs.scoremin;
var scoreMax = 10;

var scoreList = [];
var scoreContainerList = [];

var cycleIntroPause = cycletweens.intropause;
//first lont pause before cycle start
var cyclePauseIn = cycletweens.pausein;
//pause before ico tween in
var cycleTweenTimein = cycletweens.timein;
//time for ico tween in
var cycleTweenin = cycletweens.tweenin;
//tween type for ico tween in
var cyclePauseOut = cycletweens.pauseout;
//pause before tween out
var cycleTweenTimeOut = cycletweens.timeout;
//time for ico tween out
var cycleTweenOut = cycletweens.tweenout;
//tween type for ico tween in

var btnTimeIn = btnspecs.timein;
// = time tween in for btn user click
var btnTimeOut = btnspecs.timeout;
// time tween out for btn user click
var btnWait = btnspecs.wait;
// = time to display at full opacity for click
var btnTweenIn = btnspecs.tweenin;
// = time tween in for btn user click
var btnTweenOut = btnspecs.tweenout;
// = time tween out for btn user click

var exitScaleInX = exitspecs.scaleinx;
var exitScaleInY = exitspecs.scaleiny;
var exitAlphaIn = exitspecs.alphain;
var exitOffsetX = exitspecs.offsetx;
var exitOffsetY = exitspecs.offsety;
var exitTweenIn = exitspecs.tweenin;

var timerIndex = 0;
var timerList = [];
var timerMax = 0;
var timerCount = 0;
var trackTimer = false;
var timerIsOn = false;

var promptIndex = 0;
var promptList = [];

var promptScaleInX = promptspecs.scaleinx;
var promptScaleInY = promptspecs.scaleiny;
var promptAlpahIn = promptspecs.alphain;
var promptOffsetInX = promptspecs.offsetinx;
var promptOffsetInY = promptspecs.offsetiny;
var promptPauseIn = promptspecs.pausein;
var promptTimeIn = promptspecs.timein;
var promptTweenIn = promptspecs.tweenin;

var promptScaleOutX = promptspecs.scaleoutx;
var promptScaleOutY = promptspecs.scaleouty;
var promptAlpahOut = promptspecs.alphaout;
var promptOffsetOutX = promptspecs.offsetoutx;
var promptOffsetOutY = promptspecs.offsetouty;
var promptPauseOut = promptspecs.pauseout;
var promptTimeOut = promptspecs.timeout;
var promptTweenOut = promptspecs.tweenout;

var roundIndex = 0;
var roundList = [];
var roundContainerList = [];
var roundPrevious = 0;

var roundScaleInX = roundspecs.scaleinx;
var roundScaleInY = roundspecs.scaleiny;
var roundAlphaIn = roundspecs.alphain;
var roundOffsetInX = roundspecs.offsetinx;
var roundOffsetInY = roundspecs.offsetiny;
var roundPauseIn = roundspecs.pausein;
var roundTimeIn = roundspecs.timein;
var roundTweenIn = roundspecs.tweenin;

var roundScaleOutX = roundspecs.scaleoutx;
var roundScaleOutY = roundspecs.scaleouty;
var roundAlphaOut = roundspecs.alphaout;
var roundOffsetOutX = roundspecs.offsetoutx;
var roundOffsetOutY = roundspecs.offsetouty;
var roundPauseOut = roundspecs.pauseout;
var roundTimeOut = roundspecs.timeout;
var roundTweenOut = roundspecs.tweenout;

var exitSparks = gamespecs.exitsparks;
// true || false
var zeroSparks = gamespecs.zerosparks;
// true || false

var loadQueueLive = true;
var choiceList = [];
var cycleChoiceSet = [];

var gateClass = exitlinks[0].gateclass;
// winlevel, multiexit, score, choice

var autoGatewayList = [];
var autoGateTimeList = [];
var hasAutoGateway = false;
var autoGateIndex = 0;

var linkTo;
// "replace", "location", "open", "banner-open"
var linkWindow;
var windowTools = "toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes";

const MECHANIC_CONFIG = {};

function init() {
  cb.utils.ensureSynchronousConfig().then(()=>Object.assign(MECHANIC_CONFIG, CATA_CONFIG.mechanic)).then(cb.canvas.prepare).then((s)=>{
    stage = s

    addPreload();
    // FUNC in form_styler.js
    setSpecs();
  }
  ).then(()=>cb.utils.loadManifest(manifest, imgpath)).then((q)=>{
    queue = q;
    loadComplete();
  }
  ).then(()=>cb.canvas.doIntroSplash(stage)).then(startCycle);

}

function loadComplete() {
  for (let i = 0; i < manifest.length; i++) {
    if (manifest[i].class == "button") {
      addBtn(i);
    }
    if (manifest[i].class == "icon") {
      addIcon(i);
    }
    if (manifest[i].class == "prompt") {
      addPrompt(i);
    }
    if (manifest[i].class == "round") {
      addRound(i);
    }
    if (manifest[i].class == "tap") {
      addTap(i);
    }
    // FEEDBACK FOR NMBR OF CLICKS
    if (manifest[i].class == "marker") {
      addMarker(i);
    }
    if (manifest[i].class == "skin") {
      addSkin(i);
    }
    if (manifest[i].class == "exit") {
      addExit(i);
    }
    if (manifest[i].class == "timer") {
      addTimer(i);
    }
    if (manifest[i].class == "score") {
      addScore(i);
    }
  }

  addGameClass();
  removePreload();
  // FUNC in form_styler.js

  //Listening for a tick event that will update the stage
  createjs.Ticker.addEventListener("tick", handleTick);
  createjs.Ticker.framerate = 60;
  stage.enableMouseOver(10);
}

/* ------[ CONTROLS BEGIN ]------ */

function addBtn(pctIndex) {
  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img)
  bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
  bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.z = manifest[pctIndex].z;
  bmp.slot = manifest[pctIndex].slot;
  bmp.choice = manifest[pctIndex].choice;
  bmp.width = manifest[pctIndex].width;
  bmp.height = manifest[pctIndex].height;
  bmp.visible = true;
  bmp.alpha = 0;
  bmp.cursor = "not-allowed";
  bmp.index = btnList.length;
  //pctIndex;
  stage.addChild(bmp);
  //bmp.addEventListener("click", btnClick);
  btnList.push(bmp);
}

function btnClick(event) {

  if (exitlinks[0].engagepath != "none" && gameEngaged == false) {
    logEngagement("game-start")
  }
  ;if (userClickedList.length <= cycleLiveList.length) {
    btnIndex = btnList.findIndex(x=>x.slot === cycleLiveList[userClickedList.length]);

    var thisSlot = btnList[btnIndex].slot;

    userClickedList.push(thisSlot);
    checkHitClick();
    showUserCick();
  }
  // end if userClickedList

  if (userClickedList.length == cycleLiveList.length) {
    btnClickRemove();
  }

}
// end btnClick()

function showUserCick() {
  iconList[btnIndex].visible = true;
  var tween00 = createjs.Tween.get(iconList[btnIndex]).to({
    alpha: 1
  }, btnTimeIn, btnTweenIn).wait(btnWait).to({
    alpha: 0
  }, btnTimeOut, btnTweenOut).call(checkCycleClicks);
}

function checkCycleClicks() {

  //checkHitClick();

  if (userClickedList.length == cycleLiveList.length) {

    cycleIsWin = false;

    if (userClickedList.toString() == cycleLiveList.toString()) {
      cycleIsWin = true;
      if (exitFired == false) {
        scoreIndex += 1;
        tweenMarker(1);
        changeScore();
      }

    } else {
      tweenMarker(0);
    }

    winList.push(cycleIsWin);

    formatCycleChoices();

    if (sceneIndex < sceneMax) {
      sceneIndex += 1;
      cycleLoopIndex = 0;
      setCycleZ();
      startCycle();
    } else {
      showExit();
    }

  }
  // end .length if

}
// checkCycleClicks

function formatCycleChoices() {

  // CONVERT INDEX TRACKING of RANDOM JS AND UI CLICK TO btn[i].choice INFO

  var thisCycleJs = [];
  var thisCycleUi = [];

  for (i = 0; i < cycleLiveList.length; i++) {
    var targetIndex = cycleLiveList[i];
    var thisJsChoice = cycleChoiceSet[targetIndex];
    thisCycleJs.push(thisJsChoice);
    if (userClickedList[i] >= 0) {
      var thisUiIndex = userClickedList[i];
      var thisUiChoice = cycleChoiceSet[thisUiIndex];
      thisCycleUi.push(thisUiChoice);
    } else {
      thisCycleUi.push("*");
    }
  }
  // ADD THIS CYCLE TO CHOICE LIST
  var thisChoiceNode = winList[sceneIndex] + ":" + sceneIndex + "_js:" + thisCycleJs + ",_ui:" + thisCycleUi + ",&";
  choiceList.push(thisChoiceNode);

  if (gameclass != "live") {//console.log("choice cycle = " + thisChoiceNode);
  }

}

function addIcon(pctIndex) {
  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img)
  bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
  bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.z = manifest[pctIndex].z;
  bmp.slot = manifest[pctIndex].slot;
  bmp.width = manifest[pctIndex].width;
  bmp.height = manifest[pctIndex].height;
  bmp.visible = false;
  bmp.alpha = 0;
  bmp.index = iconList.length;
  //pctIndex;
  stage.addChild(bmp);
  //bmp.addEventListener("mousedown", iconClick);
  iconList.push(bmp);
}

function iconClick(event) {
  iconIndex = event.target.index;
}

function addExit(pctIndex) {
  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
  bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.width = manifest[pctIndex].width;
  bmp.height = manifest[pctIndex].height;
  bmp.visible = false;
  bmp.alpha = 0;
  bmp.cursor = "pointer";
  bmp.pause = manifest[pctIndex].pause;
  bmp.time = manifest[pctIndex].time;
  bmp.index = exitList.length;
  //pctIndex;
  stage.addChild(bmp);
  bmp.addEventListener("mousedown", exitClick);
  exitList.push(bmp);
}

function exitClick(event) {
  exitIndex = event.target.index;

  if (exitlinks[0].gatewaypath != "none") {
    exitAjax();
  } else {
    exitDemo();
  }
  // end gateway if/else

}

/* :::::::::: [ ADD MARKER START ] :::::::::: */
/* :::::::::: [ ADD MARKER START ] :::::::::: */
/* :::::::::: [ ADD MARKER START ] :::::::::: */

function addMarker(pctIndex) {

  var thisLength = (markerCount);
  var thisOffset = markerspecs.offset;

  for (q = 0; q < thisLength; q++) {

    var thisIndex = q;
    // markerBmpList.length;

    var markerMask = new createjs.Shape();
    markerMask.graphics.drawRect(0, 0, thisOffset, thisOffset);
    markerMask.regX = (thisOffset * 0.5);
    markerMask.regY = (thisOffset * 0.5);
    markerMask.x = 0;
    // manifest[pctIndex].x;
    markerMask.y = 0;
    // manifest[pctIndex].y;

    var img = queue.getResult(manifest[pctIndex].src);
    var bmp = new createjs.Bitmap(img);
    bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
    bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
    bmp.x = 0;
    bmp.y = thisOffset * q * -1;
    bmp.width = manifest[pctIndex].width;
    bmp.height = manifest[pctIndex].height;
    bmp.offset = thisOffset;
    bmp.score = 0;
    bmp.alpha = markerspecs.introalpha;
    bmp.complete = false;
    bmp.index = thisIndex;
    //pctIndex;
    bmp.mask = markerMask;
    markerBmpList.push(bmp);

    var container = new createjs.Container();
    container.x = markerspecs.markerx[thisIndex];
    container.y = markerspecs.markery[thisIndex];
    stage.addChild(container);
    container.addChild(bmp, markerMask);
    markerContainerList.push(container);

  }
  // end loop

}
// end addMarker

function tweenMarker(value) {
  var thisValue = value;

  if (markerBmpList[markerIndex] && markerBmpList[sceneIndex].complete == false) {
    markerBmpList[sceneIndex].complete = true;
    switch (thisValue) {
    case 0:
      markerBmpList[sceneIndex].x = markerBmpList[sceneIndex].x;
      // DON'T MOVE MASKED BMP
      break;
    case 1:
      markerBmpList[sceneIndex].x -= markerBmpList[sceneIndex].offset;
      // MOVE MASKED BMP 
      break;
    default:
      thisValue = thisValue;
    }
    // end switch

    var markerIn00 = createjs.Tween.get(markerBmpList[sceneIndex]).to({
      alpha: 1
    }, 300, createjs.Ease.sineOut);

  }
  // end if .complete

}
// end Marker Tween Function

/* :::::::::: [ ADD MARKER END ] :::::::::: */
/* :::::::::: [ ADD MARKER END ] :::::::::: */
/* :::::::::: [ ADD MARKER END ] :::::::::: */

function addTapContainers() {
  // BKG CONTAINER FOR 'rounds' PNGs					
  var roundContainer = new createjs.Container();
  roundContainer.x = 0;
  roundContainer.y = 0;
  stage.addChild(roundContainer);
  roundContainerList.push(roundContainer);
  //roundContainerList[0].addChild(bmp);

  var tapWrapper = new createjs.Container();
  tapWrapper.x = 0;
  tapWrapper.y = 0;
  stage.addChild(tapWrapper);
  tapWrapperList.push(tapWrapper);
}

/* :::::::::: [ ADD TAP BEGIN ] :::::::::: */
/* :::::::::: [ ADD TAP BEGIN ] :::::::::: */
/* :::::::::: [ ADD TAP BEGIN ] :::::::::: */

function addTap(pctIndex) {

  if (roundContainerList.length == 0 && tapContainerList.length == 0) {
    addTapContainers();
    // add containers for tap/click feedback if not in place
  }

  var thisLength = (tapCount);
  var thisOffset = tapspecs.offset;

  for (k = 0; k < thisLength; k++) {

    var thisIndex = k;
    // tapBmpList.length;

    var tapMask = new createjs.Shape();
    tapMask.graphics.drawRect(0, 0, thisOffset, thisOffset);
    tapMask.regX = (thisOffset * 0.5);
    tapMask.regY = (thisOffset * 0.5);
    tapMask.x = 0;
    // manifest[pctIndex].x;
    tapMask.y = 0;
    // manifest[pctIndex].y;

    var img = queue.getResult(manifest[pctIndex].src);
    var bmp = new createjs.Bitmap(img);
    bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
    bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
    bmp.x = 0;
    bmp.y = thisOffset * k * -1;
    bmp.width = manifest[pctIndex].width;
    bmp.height = manifest[pctIndex].height;
    bmp.offset = thisOffset;
    bmp.score = 0;
    bmp.alpha = tapspecs.introalpha;
    bmp.complete = false;
    bmp.index = thisIndex;
    //pctIndex;
    bmp.mask = tapMask;
    tapBmpList.push(bmp);

    var container = new createjs.Container();
    container.x = k * thisOffset;
    container.y = tapCenterY;
    //stage.addChild(container);
    tapWrapperList[0].addChild(container);
    container.addChild(bmp, tapMask);
    tapContainerList.push(container);

  }
  // end loop

}
// end addTap

function checkHitClick() {

  var thisIndex = userClickedList.length - 1;
  var isMatch = false;
  var thisCycleNode = cycleLiveList[thisIndex];
  var thisUiClick = userClickedList[thisIndex];
  var targetX = 0;

  if (thisCycleNode == thisUiClick) {
    isMatch = true;
    //tapBmpList[thisIndex].x = tapBmpList[thisIndex].offset;
  }

  //tapBmpList[thisIndex].x = targetX;
  //var true00 = createjs.Tween.get(tapBmpList[thisIndex]).to({alpha:1}, 300, createjs.Ease.sineOut);

  switch (isMatch) {
  case true:
    tapBmpList[thisIndex].x += (tapBmpList[thisIndex].offset * -1);
    var true00 = createjs.Tween.get(tapBmpList[thisIndex]).to({
      alpha: 1
    }, 300, createjs.Ease.sineOut);
    break;
  case false:
    var false00 = createjs.Tween.get(tapBmpList[thisIndex]).to({
      alpha: 1
    }, 300, createjs.Ease.sineOut);
    break;
  default:
    isMatch = isMatch;
  }

}

function resetTaps() {

  for (i = 0; i < tapBmpList.length; i++) {
    if (i == 0) {
      var tween00 = createjs.Tween.get(tapBmpList[i]).to({
        alpha: 0
      }, 300, createjs.Ease.sineIn).to({
        x: 0
      }, 300, createjs.Ease.sineIn).wait(tapPauseOut).call(resetTapWrapper);
    } else {
      var tween01 = createjs.Tween.get(tapBmpList[i]).to({
        alpha: 0
      }, 300, createjs.Ease.sineIn).to({
        x: 0
      }, 300, createjs.Ease.sineIn);
    }

  }

}

function resetTapWrapper() {
  var thisCycleLength = cycleLiveList.length;
  var thisX = tapCenterX - Math.round(thisCycleLength * tapWrapOffset * 0.5) + Math.round(tapWrapOffset * 0.5);
  tapWrapperList[0].x = thisX;
}

/* :::::::::: [ ADD TAP END ] :::::::::: */
/* :::::::::: [ ADD TAP END ] :::::::::: */
/* :::::::::: [ ADD TAP END ] :::::::::: */

function addSkin(pctIndex) {
  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
  bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.width = manifest[pctIndex].width;
  bmp.height = manifest[pctIndex].height;
  bmp.index = skinList.length;
  //pctIndex;
  stage.addChild(bmp);
  skinList.push(bmp);
}

/* :::::::::: [ ADD ROUND START ] :::::::::: */
/* :::::::::: [ ADD ROUND START ] :::::::::: */
/* :::::::::: [ ADD ROUND START ] :::::::::: */

function addRound(pctIndex) {

  if (roundContainerList.length == 0 && tapContainerList.length == 0) {
    addTapContainers();
    // add containers for tap/click feedback if not in place
  }

  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
  bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.width = manifest[pctIndex].width;
  bmp.height = manifest[pctIndex].height;
  bmp.index = roundList.length;
  //pctIndex;
  bmp.alpha = 0;
  roundContainerList[0].addChild(bmp);
  roundList.push(bmp);
}

function tweenRounds() {
  var lastIndex = sceneIndex - 1;
  var targetInX = roundList[sceneIndex].x;
  var targetInY = roundList[sceneIndex].y;
  var thisPauseIn = roundPauseIn;

  roundList[sceneIndex].x = (targetInX + roundOffsetInX);
  roundList[sceneIndex].y = (targetInY + roundOffsetInY);
  roundList[sceneIndex].alpha = roundAlphaIn;
  roundList[sceneIndex].scaleX = roundScaleInX;
  roundList[sceneIndex].scaleY = roundScaleInY;

  if (sceneIndex == 0) {
    thisPauseIn = 0
  }
  ;if (isMemoryGame == false) {
    roundPauseIn = roundTimeIn = 5;
    roundList[sceneIndex].visible = false;
    roundPauseOut = 0;
  }

  var roundIn00 = createjs.Tween.get(roundList[sceneIndex]).wait(roundPauseIn).to({
    x: targetInX,
    y: targetInY,
    scaleX: 1,
    scaleY: 1,
    alpha: 1
  }, roundTimeIn, roundTweenIn).wait(500).call(resetTaps);

  if (sceneIndex > 0) {

    var targetOutX = (roundList[lastIndex].x + roundOffsetOutX);
    var targetOutY = (roundList[lastIndex].y + roundOffsetOutY);

    var roundOut00 = createjs.Tween.get(roundList[lastIndex]).wait(roundPauseOut).to({
      x: targetOutX,
      y: targetOutY,
      scaleX: roundScaleOutX,
      scaleY: roundScaleOutY,
      alpha: roundAlphaOut
    }, roundTimeOut, roundTweenOut);
  }

}

/* :::::::::: [ ADD ROUND END ] :::::::::: */
/* :::::::::: [ ADD ROUND END ] :::::::::: */
/* :::::::::: [ ADD ROUND END ] :::::::::: */

/* :::::::::: [ ADD PROMPT START ] :::::::::: */
/* :::::::::: [ ADD PROMPT START ] :::::::::: */
/* :::::::::: [ ADD PROMPT START ] :::::::::: */

function addPrompt(pctIndex) {
  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
  bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.width = manifest[pctIndex].width;
  bmp.height = manifest[pctIndex].height;
  bmp.homex = manifest[pctIndex].x;
  bmp.homey = manifest[pctIndex].y;
  bmp.alpha = 0;
  bmp.index = promptList.length;
  //pctIndex;
  stage.addChild(bmp);
  promptList.push(bmp);
}

function changePrompt(index) {

  switch (index) {
  case 0:
    promptIn00();
    break;
  case 1:
    promptIn01();
    break;
  default:
    index = index;
  }

}

function promptIn00() {

  var targetInX = promptList[0].homex;
  var targetInY = promptList[0].homey;

  var targetOutX = promptList[1].homex + promptOffsetOutX;
  var targetOutY = promptList[1].homey + promptOffsetOutY;

  promptList[0].x = promptList[0].homex + promptOffsetInX;
  promptList[0].y = promptList[0].homey + promptOffsetInY;
  promptList[0].scaleX = promptScaleInX;
  promptList[0].scaleY = promptScaleInY;
  promptList[0].alpha = promptAlpahIn;

  var prompt00 = createjs.Tween.get(promptList[0]).wait(promptPauseIn).to({
    x: targetInX,
    y: targetInY,
    scaleX: 1,
    scaleY: 1,
    alpha: 1
  }, promptTimeIn, promptTweenIn);

  var prompt01 = createjs.Tween.get(promptList[1]).wait(promptPauseOut).to({
    x: targetOutX,
    y: targetOutY,
    scaleX: promptScaleOutX,
    scaleY: promptScaleOutY,
    alpha: promptAlpahOut
  }, promptTimeOut, promptTweenOut);

}

function promptIn01() {

  var targetInX = promptList[1].homex;
  var targetInY = promptList[1].homey;

  var targetOutX = promptList[0].homex + promptOffsetOutX;
  var targetOutY = promptList[0].homey + promptOffsetOutY;

  promptList[1].x = promptList[1].homex + promptOffsetInX;
  promptList[1].y = promptList[1].homey + promptOffsetInY;
  promptList[1].scaleX = promptScaleInX;
  promptList[1].scaleY = promptScaleInY;
  promptList[1].alpha = promptAlpahIn;

  var prompt02 = createjs.Tween.get(promptList[0]).wait(promptPauseOut).to({
    x: targetOutX,
    y: targetOutY,
    scaleX: promptScaleOutX,
    scaleY: promptScaleOutY,
    alpha: promptAlpahOut
  }, promptTimeOut, promptTweenOut);

  var prompt03 = createjs.Tween.get(promptList[1]).wait(promptPauseIn).to({
    x: targetInX,
    y: targetInY,
    scaleX: 1,
    scaleY: 1,
    alpha: 1
  }, promptTimeIn, promptTweenIn);

}

/* :::::::::: [ ADD PROMPT END ] :::::::::: */
/* :::::::::: [ ADD PROMPT END ] :::::::::: */
/* :::::::::: [ ADD PROMPT END ] :::::::::: */

/* :::::::::: [ TIMER FUNCTIONS BEGIN ] ::::::::::: */
/* :::::::::: [ TIMER FUNCTIONS BEGIN ] ::::::::::: */

function addTimer(pctIndex) {

  var thisOffset = manifest[pctIndex].offset;

  var timerMask = new createjs.Shape();
  timerMask.graphics.drawRect(0, 0, thisOffset, thisOffset);
  timerMask.regX = (thisOffset * 0.5);
  timerMask.regY = (thisOffset * 0.5);
  timerMask.x = manifest[pctIndex].x;
  timerMask.y = manifest[pctIndex].y;

  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.regX = Math.round(thisOffset * 0.5);
  bmp.regY = Math.round(thisOffset * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.width = thisOffset;
  bmp.height = thisOffset;
  bmp.offset = thisOffset;
  bmp.alpha = 0;
  //bmp.visible = manifest[pctIndex].track;
  bmp.visible = false;
  bmp.index = timerList.length;
  //pctIndex;
  bmp.yhome = manifest[pctIndex].y + thisOffset;
  bmp.loopcount = 0;
  stage.addChild(bmp);
  bmp.mask = timerMask;
  timerList.push(bmp);

  trackTimer = manifest[pctIndex].track;

}

function startTimer() {

  // ... OR, CONTINUE WITH TIMER...
  if (timerCount < timerMax && userClickedList.length < cycleLiveList.length && timerIsOn == true && exitFired == false) {
    if (timerCount >= 0) {
      timerList[0].visible = true;
    }
    timerCount += 1;
    timerList[0].alpha = 0;
    timerList[0].y -= timerList[0].offset;
    timerList[0].scaleX = 0.1;
    var timer01 = createjs.Tween.get(timerList[0]).to({
      alpha: 1,
      scaleX: 1,
    }, 100, createjs.Ease.sineIn).wait(900).call(startTimer);
  }

  // CLOSE THIS CYCLE ....
  if (timerCount >= timerMax && userClickedList.length < cycleLiveList.length) {
    //at timerMax fill unused User clicks with 'x', then check cycle....   
    for (i = 0; i < cycleLiveList.length; i++) {
      if (userClickedList[i]) {
        userClickedList[i] = userClickedList[i];
      } else {
        userClickedList.push(-1);
        // LOGG -1 IF NOT CLICKED
      }
    }

    var timer01 = createjs.Tween.get(timerList[0]).to({
      alpha: 0,
      scaleX: 1,
    }, 100, createjs.Ease.sineIn).wait(900);

    checkCycleClicks();
  }

}

function resetTimer() {
  // RESET TIME COUNT...
  timerIsOn = false;
  timerCount = -1;
  var thisY = timerList[0].yhome;
  timerList[0].loopcount += 1;
  var reset00 = createjs.Tween.get(timerList[0]).to({
    alpha: 0,
    scaleX: 1,
  }, 300, createjs.Ease.sineIn).to({
    y: thisY,
  }, 300, createjs.Ease.linear);
}

/* :::::::::: [ TIMER FUNCTIONS END ] ::::::::::: */
/* :::::::::: [ TIMER FUNCTIONS END ] ::::::::::: */

/* :::::::::: [ SCORE FUNCTIONS START ] ::::::::::: */
/* :::::::::: [ SCORE FUNCTIONS START ] ::::::::::: */

function addScore(pctIndex) {

  var thisOffset = manifest[pctIndex].offset;
  var thisIndex = scoreList.length;

  var scoreMask = new createjs.Shape();
  scoreMask.graphics.drawRect(0, 0, thisOffset, thisOffset);
  scoreMask.regX = (thisOffset * 0.5);
  scoreMask.regY = (thisOffset * 0.5);
  scoreMask.x = 0;
  // manifest[pctIndex].x;
  scoreMask.y = 0;
  // manifest[pctIndex].y;

  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.regX = Math.round(thisOffset * 0.5);
  bmp.regY = Math.round(thisOffset * 0.5);
  bmp.x = 0;
  // manifest[pctIndex].x;
  bmp.y = 0;
  // manifest[pctIndex].y;
  bmp.width = thisOffset;
  bmp.height = thisOffset;
  bmp.offset = thisOffset;
  bmp.visible = true;
  bmp.alpha = 0;
  bmp.index = thisIndex;
  //pctIndex;
  bmp.mask = scoreMask;
  scoreList.push(bmp);

  var container = new createjs.Container();
  container.x = manifest[pctIndex].x;
  container.y = manifest[pctIndex].y;
  stage.addChild(container);
  container.addChild(bmp, scoreMask);
  scoreContainerList.push(container);
  // scoreContainerList[0] = standard score, scoreContainerList[1] = popup score

}

function changeScore() {

  scoreList[0].alpha = 0
  scoreList[0].y -= scoreList[0].offset;
  // move display score
  scoreList[1].y -= scoreList[1].offset;
  // move exit sccore
  scoreList[0].scaleX = 0.1;
  var score01 = createjs.Tween.get(scoreList[0]).to({
    alpha: 1,
    scaleX: 1,
  }, 100, createjs.Ease.sineIn);

}

/* :::::::::: [ SCORE FUNCTIONS END ] ::::::::::: */
/* :::::::::: [ SCORE FUNCTIONS END ] ::::::::::: */

/* ------[ CONTROLS END ]------ */

function startCycle() {

  userClickedList = [];
  cycleLiveList = [];
  cycleTipList = [];
  // list to track by plain numbers, (zero index plus one)

  btnClickRemove();

  var thisCycle;
  var thisLength = cycleLengthList[sceneIndex];

  if (trackTimer == true) {
    timerMax = cycleTimeList[sceneIndex];
  }

  if (cycleClassList[sceneIndex]) {

    switch (cycleClassList[sceneIndex]) {
    case "memory":
      thisCycle = cycleSetList[sceneIndex].sort(function(a, b) {
        return 0.5 - Math.random()
      });
      // randomize array
      break;
    case "guess":
      if (isMemoryGame == true) {
        thisCycle = cycleSetList[sceneIndex].sort(function(a, b) {
          return 0.5 - Math.random()
        });
        // randomize array
      } else {
        // if number entry guess game....
        thisCycle = cycleSetList[sceneIndex];
        // randomize array
      }
      ;break;
    default:
      thisCycle = cycleSetList[sceneIndex].sort(function(a, b) {
        return 0.5 - Math.random()
      });
    }

  } else {
    thisCycle = cycleSetList[sceneIndex].sort(function(a, b) {
      return 0.5 - Math.random()
    });
  }

  cycleLiveList = thisCycle.slice(0, thisLength);
  // crop arrray to specified length

  for (i = 0; i < cycleLiveList.length; i++) {
    var indexPlain = cycleLiveList[i] + 1;
    cycleTipList.push(indexPlain);
  }

  if (keyList[sceneIndex] != "none" && cycleClassList[sceneIndex] == "guess") {
    formatGuessKey();
  }

  if (gameclass != "live") {
    console.log("scene:" + sceneIndex + " tipLiveList=" + cycleTipList + "  ==> this QA console hides on LIVE game play!");
  }

  for (i = 0; i < iconList.length; i++) {
    iconList[i].alpha = 0;
    // reset alpha to zero
  }

  var thisChoiceSet = [];

  //
  for (i = 0; i < btnList.length; i++) {
    if (btnList[i].z == sceneIndex) {
      thisChoiceSet.push(btnList[i].choice);
    }
  }

  cycleChoiceSet = thisChoiceSet;

  if (scoreList[0].alpha == 0) {
    var scoreIn00 = createjs.Tween.get(scoreList[0]).to({
      alpha: 1
    }, 500, createjs.Ease.sineOut);
  }

  if (isMemoryGame == true) {
    changePrompt(0);
    tweenRounds();
  } else {
    resetTaps();
    btnClickAdd();
    //changePrompt(1);
  }
  //changePrompt(0);
  //tweenRounds();
  doCycleLoop();

}

function formatGuessKey() {
  var thisValue = keyList[sceneIndex]
    , thisSplit = thisValue.split("")
    , keyResultList = []
    , tipResultList = [];
  for (i = 0; i < thisSplit.length; i++) {
    var thisIndexOf = alphaBetList.indexOf(thisSplit[i]);
    thisIndexOf >= 0 && thisIndexOf < 10 && keyResultList.push(thisIndexOf) && tipResultList.push(thisIndexOf)
  }
  cycleLiveList = keyResultList;
  cycleTipList = tipResultList;
}

function doCycleLoop() {

  if (cycleLoopIndex < cycleLiveList.length) {
    var thisIndex = cycleLiveList[cycleLoopIndex];
    if (isMemoryGame == true) {
      // show icon for memory cycle
      iconList[thisIndex].visible = true;
    } else {
      iconList[thisIndex].visible = false;
      cycleTweenTimein = cyclePauseOut = cycleTweenTimeOut = 5;
      // shorten times to bypass
    }

    var thisPause = cyclePauseIn;

    if (cycleLoopIndex == 0) {
      thisPause = cycleIntroPause;
    }

    var cycling00 = createjs.Tween.get(iconList[thisIndex]).wait(thisPause).to({
      alpha: 1
    }, cycleTweenTimein, cycleTweenin).wait(cyclePauseOut).to({
      alpha: 0
    }, cycleTweenTimeOut, cycleTweenOut).call(doCycleLoop);

    cycleLoopIndex += 1;
  } else {
    if (isMemoryGame == true) {
      btnClickAdd();
      // make btn clickable
    }
    // if memoryGame
  }
  // end else

}

function setCycleZ() {
  // change .z property if same icons are repeated in multiple cycles....
  var thisZ = 0;

  if (zCycleClass == "single") {

    for (i = 0; i < iconList.length; i++) {
      iconList[i].z += 1;
      thisZ = iconList[i].z;
      // only for console log testing...
    }
    // end for

    for (i = 0; i < btnList.length; i++) {
      btnList[i].z += 1;
    }
    // end for

  }

}
// end setCycleZ()

function btnClickAdd() {
  for (i = 0; i < btnList.length; i++) {
    btnList[i].addEventListener("click", btnClick);
    btnList[i].cursor = "pointer";
  }
  // end for

  changePrompt(1);

  if (trackTimer == true) {
    timerIsOn = true;
    startTimer();
  }

}

function btnClickRemove() {
  for (i = 0; i < btnList.length; i++) {
    btnList[i].removeAllEventListeners();
    btnList[i].cursor = "not-allowed";
    if (btnList[i].alpha < 1 && btnList[i].z == sceneIndex) {
      var btn00 = createjs.Tween.get(btnList[i]).to({
        alpha: 1
      }, 300, createjs.Ease.sineInOut);
    }
  }
  // end for
  if (trackTimer == true) {
    resetTimer();
  }
}

function btnClickExitRemove() {
  for (i = 0; i < btnList.length; i++) {
    btnList[i].removeAllEventListeners();
    btnList[i].cursor = "default";
  }
  // end for
}

function showExit() {

  var thisExit = scoreIndex;

  if (exitFired == false) {

    exitFired = true;
    choiceList.push("total:" + scoreIndex);

    switch (gateClass) {
    case "winlevel":
      thisExit = winlevel;
      break;
    case "multiexit":
      thisExit = scoreIndex;
      break;
    case "score":
      if (scoreIndex < scoreMin) {
        thisExit = 0;
      } else {
        thisExit = 1;
      }
      break;
    default:
      thisExit = thisExit;
    }

    autoGateIndex = thisExit;
    // exitIndex

    var thisPause = exitList[thisExit].pause;
    var thisTime = exitTime = exitList[thisExit].time;
    var exitTargetX = exitList[thisExit].x;
    var exitTargetY = exitList[thisExit].y;

    exitList[thisExit].visible = true;
    exitList[thisExit].alpha = exitAlphaIn;
    exitList[thisExit].y = (exitTargetY + exitOffsetY);
    exitList[thisExit].x = (exitTargetX + exitOffsetX);
    exitList[thisExit].scaleX = exitScaleInX;
    exitList[thisExit].scaleY = exitScaleInY;

    var exit00 = createjs.Tween.get(exitList[thisExit]).call(btnClickExitRemove).wait(thisPause).call(doAutoGateway).call(showExitSparks).call(closeUi).to({
      x: exitTargetX,
      y: exitTargetY,
      alpha: 1,
      scaleX: 1,
      scaleY: 1
    }, thisTime, exitTweenIn).call(socialFinal);

    showExitScore(thisExit);

    if (gameclass == "test" || gameclass == "live") {
      // submit choice tracking
      enterChoice();
      if (!CATA_CONFIG?.general?.allowRepeatPlay) {
        //mark the current play as played on server
        $.get(document.URL.split('?')[0] + '/scratch');
      }
    }

  }
  // end exitFired

}
// showExit();

function closeUi() {
  // hide & turn off ui for exit display

  trackTimer = false;

  var prompt00 = createjs.Tween.get(promptList[0]).to({
    alpha: 0
  }, exitTime, createjs.Ease.sineOut);
  var prompt01 = createjs.Tween.get(promptList[1]).to({
    alpha: 0
  }, exitTime, createjs.Ease.sineOut);
  var score00 = createjs.Tween.get(scoreContainerList[0]).to({
    alpha: 0
  }, exitTime, createjs.Ease.sineOut);
  var timer00 = createjs.Tween.get(timerList[0]).to({
    alpha: 0
  }, exitTime, createjs.Ease.sineOut);
  var round00 = createjs.Tween.get(roundList[sceneIndex]).to({
    alpha: 0
  }, exitTime, createjs.Ease.sineOut);
  var tap00 = createjs.Tween.get(tapWrapperList[0]).to({
    alpha: 0
  }, exitTime, createjs.Ease.sineOut);

}

function showExitScore(index) {
  var targetIndex = index;

  var thisPause = exitList[targetIndex].pause;
  var thisTime = exitList[targetIndex].time;
  var exitTargetX = scoreList[1].x;
  var exitTargetY = scoreList[1].y;

  scoreList[1].alpha = exitAlphaIn;
  scoreList[1].y = (exitTargetY + exitOffsetY);
  scoreList[1].x = (exitTargetX + exitOffsetX);
  scoreList[1].scaleX = exitScaleInX;
  scoreList[1].scaleY = exitScaleInY;

  var score01 = createjs.Tween.get(scoreList[1]).wait(thisPause).to({
    x: exitTargetX,
    y: exitTargetY,
    alpha: 1,
    scaleX: 1,
    scaleY: 1
  }, thisTime, exitTweenIn);

}

function showExitSparks() {
  var xSparks = Math.round(stage.canvas.width * 0.5);
  var ySparks = Math.round(stage.canvas.height * 0.5);

  if (exitSparks == true) {

    switch (gateClass) {
    case "winlevel":
      if (zeroSparks == true) {
        addSparkles(0, xSparks, ySparks);
      } else {
        if (winlevel > 0) {
          addSparkles(0, xSparks, ySparks);
        }
      }
      break;
    case "score":
      if (zeroSparks == true) {
        addSparkles(0, xSparks, ySparks);
      } else {
        if (scoreIndex >= scoreMin) {
          addSparkles(0, xSparks, ySparks);
        }
      }
      break;
    case "multiexit":
      if (zeroSparks == true) {
        addSparkles(0, xSparks, ySparks);
      } else {
        if (scoreIndex > 0) {
          addSparkles(0, xSparks, ySparks);
        }
      }
      break;
    case "none":
      // local wireframe
      if (zeroSparks == true) {
        addSparkles(0, xSparks, ySparks);
      } else {
        if (scoreIndex > 0) {
          addSparkles(0, xSparks, ySparks);
        }
      }
      break;
    default:
      if (zeroSparks == true) {
        addSparkles(0, xSparks, ySparks);
      } else {
        if (exitIndex > 0) {
          addSparkles(0, xSparks, ySparks);
        }
      }
    }
    // end switch

  }
  // end exitSparkIf

}

function socialFinal() {
  if (exitlinks[0].showsocial) {
    // if social header present....
    var showThis = exitlinks[0].showsocial;
    var socialShowList = showThis.split("|");

    if (socialShowList[winlevel] == "true") {
      $("#boomSocial").delay(1000).fadeIn();
    }
    // end  social if
  }
  // end livegame if
}
// end social final

/* :::::::::: [ UTILITY FUNCTIONS START ] ::::::::::: */
/* :::::::::: [ UTILITY FUNCTIONS START ] ::::::::::: */
/* :::::::::: [ UTILITY FUNCTIONS START ] ::::::::::: */

function setSpecs() {

  var thisForm = "<form class='collapse' id='choiceForm'><input name='upshotpath' id='upshotpath' class='form-control' value=''></form>";
  $('body').append(thisForm);

  var thisUrl = window.location.href;
  var indexOfFile = thisUrl.indexOf("file:");
  if (indexOfFile > -1) {
    loadQueueLive = false;
  }

  if (exitlinks[0].gateclass) {

    if (gateClass == "none") {
      gateClass = "winlevel"
    }
    ;if (exitlinks[0].autogateway) {
      // format arrays for autoGateway
      specAutoGateway();
    }
    // end autogateway if

    // set exit graphics for game gateway type
    var exitCount = -1;
    var choiceCount = -1;
    for (i = 0; i < manifest.length; i++) {
      if (manifest[i].class == "exit") {
        exitCount += 1;
        switch (gateClass) {
        case "winlevel":
          if (exitCount != winlevel) {
            manifest[i].src = "spacer1x1canvas.png"
          }
          ;break;
        case "score":
          if (exitCount > 1) {
            manifest[i].src = "spacer1x1canvas.png"
          }
          ;break;
        case "choice":
          if (exitCount < 1) {
            manifest[i].src = "spacer1x1canvas.png"
          }
          ;//clickClass = "target";
          break;
        case "multiexit":
          gateClass = gateClass;
          //clickClass = "target";
          break;
        default:
          gateClass = gateClass;
        }
        // end switch
        if (hasAutoGateway == true && autoGateTimeList[exitCount] == 0) {
          manifest[i].src = "spacer1x1canvas.png";
        }
      }
      // end if

    }
    // end exit graphic for loop

  }
  // end gateclass if

}
//  setSpecs

/* ::::::::::: [ AUTOGATEWAY SPECS START ] ::::::::::: */
/* ::::::::::: [ AUTOGATEWAY SPECS START ] ::::::::::: */

function specAutoGateway() {
  var thisAutoList = exitlinks[0].autogateway.replace(/[^0-9,.-]/g, "").split(",");

  // POPULATE autoGatewayList FROM thisAutoList ....
  if (exitlinks[0].autogateway != "-1") {
    for (i = 0; i < thisAutoList.length; i++) {
      var thisNumber = parseFloat(thisAutoList[i]);
      autoGatewayList.push(thisNumber);
    }
    hasAutoGateway = true;
  } else {
    autoGatewayList.push(-1)
  }

  // FILL IN BLANKS FOR 0-10 EXITS, WITH LAST NUMBER PROVIDED ....
  if (hasAutoGateway == true && thisAutoList.length < 11) {
    // complete array for exits 0-10
    for (i = 0; i < 11; i++) {
      var lastNumber = autoGatewayList.length - 1;
      if (i >= thisAutoList.length) {
        var newNumber = autoGatewayList[lastNumber];
        autoGatewayList.push(newNumber);
      }
    }
  }

  // GENERATATE TWEEN TIMES ....
  for (i = 0; i < autoGatewayList.length; i++) {
    var thisTime = autoGatewayList[i] * 1000;
    if (thisTime > 1) {
      autoGateTimeList.push(thisTime);
    } else {
      autoGateTimeList.push(autoGatewayList[i]);
    }
  }
}
/* ::::::::::: [ AUTOGATEWAY SPECS END ] ::::::::::: */
/* ::::::::::: [ AUTOGATEWAY SPECS END ] ::::::::::: */

function addGameClass() {

  switch (gameclass) {
  case "live":
    gameclass = gameclass;
    break;
  case "presentation":
    gameclass = gameclass;
    break;
  default:
    var ucGameClass = gameclass.toUpperCase();
    var txt = new createjs.Text(ucGameClass,"21px Arial","#FFFFFF");
    txt.x = 320;
    txt.y = 445;
    txt.alpha = 0.6;
    txt.textAlign = "center";
    txt.shadow = new createjs.Shadow("#000000",2,2,1);
    stage.addChild(txt);
  }
  //end switch

}

/* ::::::::::: [ AUTOGATEWAY CONTROLS START ] :::::::::: */
/* ::::::::::: [ AUTOGATEWAY CONTROLS START ] :::::::::: */

function doAutoGateway() {
  if (hasAutoGateway == true) {

    var thisTime = autoGateTimeList[autoGateIndex];

    switch (thisTime) {
    case 0:
      hasAutoGateway = true;
      if (exitSparks) {
        exitSparks = false
      }
      ;// turn off sparks
      exitList[autoGateIndex].visible = false;
      // hide exit button
      scoreList[1].visible = false;
      ;// hide exit score png
      setTimeout(doGatewayTimeOut, thisTime);
      break;
    case -1:
      hasAutoGateway = false;
      break;
    default:
      hasAutoGateway = true;
      setTimeout(doGatewayTimeOut, thisTime);
    }
    // end thisTime switch

  }
  // end hasAutoGateway if
}

function doGatewayTimeOut() {

  if (linkTo != "location") {
    // REMOVE EXIT PNG CLICK IF SECURE EXIT ( PREVENTS DOUBLE SUBMISSION)
    exitList[autoGateIndex].removeAllEventListeners();
  }

  if (exitlinks[0].gatewaypath != "none") {
    exitAjax();
  } else {
    exitDemo();
  }
  // end gateway if/else
}

function exitDemo() {
  // REPLACES exitWin() & exitLoss
  var exitDefaultList = [exitlinks[0].default0, exitlinks[0].default1, exitlinks[0].default2, exitlinks[0].default3, exitlinks[0].default4, exitlinks[0].default5, exitlinks[0].default6, exitlinks[0].default7, exitlinks[0].default8, exitlinks[0].default9, exitlinks[0].default10, ];

  if (exitlinks[0].gatewaypath == "none") {
    window.location.replace(exitDefaultList[autoGateIndex]);
  }

}

/* ::::::::::: [ AUTOGATEWAY CONTROLS END ] :::::::::: */
/* ::::::::::: [ AUTOGATEWAY CONTROLS END ] :::::::::: */

/* ::::::::::: [ LOG CHOICE START ] :::::::::: */
/* ::::::::::: [ LOG CHOICE START ] :::::::::: */

function enterChoice() {
  // record selected and add array to form element
  $('#upshotpath').val(choiceList);

  if (gameclass == "test" || gameclass == "live") {
    //send the chosen item to server
    choiceAjax();
  }
}

function choiceAjax() {

  $.ajax({
    type: "POST",
    url: exitlinks[0].choicepath,
    data: $('#choiceForm').serialize(),
    error: function(response) {
      var data = JSON.parse(response.responseText);
      if ("url"in data) {
        window.location.href = data.url;
      } else {
        alert("Error: " + response.text);
      }
      //end if/else  // end error func
    }
  });

}
// end choiceAjax

/* ::::::::::: [ LOG CHOICE END ] :::::::::: */
/* ::::::::::: [ LOG CHOICE END ] :::::::::: */

/* ::::::::::: [ EXIT AJAX START ] :::::::::: */
/* ::::::::::: [ EXIT AJAX START ] :::::::::: */

function getParameterToEnd(name, url) {
  if (!url)
    url = window.location.href;
  loc = url.lastIndexOf(name);
  if (loc < 0)
    return null;
  return url.slice(loc + name.length + 1, url.length);
}

function exitAjax() {

  if (exitlinks[0].engagepath != "none") {
    logEngagement("game-end")
  }
  ;var thisResult = scoreIndex;

  var exitspecs = {
    gameclass: exitlinks[0].gateclass,
    picklist: choiceList,
    score: scoreIndex,
    exit: winlevel,
    // choiceList[lastChoice]
    result: thisResult,
  };

  switch (gateClass) {
  case "choice":
    if (choiceList.length > 0) {
      // set to 1 multi-question choice
      exitspecs.score = 1;
      exitspecs.exit = "1";
    } else {
      exitspecs.score = 0;
      exitspecs.exit = "0";
    }
    break;
  case "score":
    if (scoreIndex < scoreMin) {
      exitspecs.score = 0;
      exitspecs.exit = "0";
    } else {
      exitspecs.score = 1;
      exitspecs.exit = "1";
    }
    break;
  case "multiexit":
    if (scoreIndex <= 10) {
      exitspecs.score = scoreIndex;
      exitspecs.exit = scoreIndex.toString();
    } else {
      exitspecs.score = 0;
      exitspecs.exit = "0";
    }
    break;
  default:
    gateClass = gateClass;
  }

  $.ajax({
    type: "POST",
    url: exitlinks[0].gatewaypath,
    data: exitspecs,
    // USE IF CHOICE RESULT
    success: function(response) {
      // STANDARD CATABOOM EXITS...
      if (!response.linkto) {
        throw new Error('Invalid gateway response: linkto not included in response')
      }
      linkTo = response.linkto;
      switch (linkTo) {
      case "replace":
        window.location.replace(response.url);
        break;
      case "location":
        window.location.href = response.url;
        break;
      case "history":
        var historySource = 1;
        if ("steps"in response) {
          historySource = response.steps;
        } else {
          historySource = response.url;
        }
        var historySteps = Number(historySource.replace(/\D+/g, '')) * -1;
        window.history.go(historySteps);
        break;
      case "topframe":
        window.top.location.href = response.url;
        break;
      case "open":
        linkWindow = window.open('', '_blank', windowTools);
        linkWindow.document.body.style.backgroundColor = "#000000";
        linkWindow.location.href = response.url;
        break;
      case "banner-open":
        // BANNER CLICKTRACK EXITS...
        linkWindow = window.open('', '_blank', windowTools);
        linkWindow.document.body.style.backgroundColor = "#000000";
        var clickTrackerURL = getParameterToEnd("click");
        // START CALCULATE URL (AND JUMP), ADD DOMAIN IF RELATIVE LINK
        if (clickTrackerURL) {
          if (response.url.startsWith("/")) {
            var thisLink = clickTrackerURL + window.location.href.split('/').slice(0, 3).join('/') + response.url;
            linkWindow.location.href = thisLink;
          } else {
            linkWindow.location.href = clickTrackerURL + response.url;
          }
        } else {
          linkWindow.location.href = response.url;
        }
        // END CALCULATE URL (AND JUMP)
        break;
      default:
        window.location.replace(response.url);
      }
      // end switch linkTo
    },
    // end success
    error: function(response) {
      var data = JSON.parse(response.responseText);
      if ("url"in data) {
        window.location.replace(data.url);
      } else {
        alert("Error: " + response.text);
      }
      //end if/else  // end error func
    }
  });
}
// end exitAjax

/* ::::::::::: [ EXIT AJAX END ] :::::::::: */
/* ::::::::::: [ EXIT AJAX END ] :::::::::: */

/* :::::::::: [ UTILITY FUNCTIONS END ] ::::::::::: */
/* :::::::::: [ UTILITY FUNCTIONS END ] ::::::::::: */
/* :::::::::: [ UTILITY FUNCTIONS END ] ::::::::::: */

//Need when having animation.
function handleTick(event) {
  stage.update();
}
