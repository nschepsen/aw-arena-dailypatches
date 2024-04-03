// JavaScript Document

var stage;
var queue;

var iconIndex;
var iconList = [];
var iconContainer;
var firstIconDrag = false;

var exitIndex;
var exitList = [];
var exitDisplayed = false;
var exitFired = false;
var exitTweenIn = exitspecs.tweenin;

var skinIndex;
var skinList = [];

var finishList = [];

var timerIndex = 0;
var timerList = [];

var timeCount = gamespecs[0].timer;
//60;
var timeMax = gamespecs[0].timer;
//60;

var dropTime = droptween[0].timey;
var introPause = gamespecs[0].intropause;
var introTime = gamespecs[0].introtime;
var dropTimeX = droptween[0].timex;
var dropDistance = droptween[0].distance;
var yDropMax = droptween[0].ydropmax;

var scoreIndex = 0;

var minimumScore = gamespecs[0].minscore;
var clickCount = 0;

var minimumDist = gamespecs[0].mindist;

var targetMatch = gamespecs[0].targetmatch;
// "strict", or "open"
var xTargetList = [];
var yTargetList = [];
var openTargetList = [];

var autoGatewayList = [];
var autoGateTimeList = [];
var hasAutoGateway = false;
var autoGateIndex = 0;

var loadQueueLive = true;
var gateClass = exitlinks[0].gateclass;
var gateStyle = gamespecs[0].gatestyle;
var choiceList = [];
var gameEngaged = false;

var linkTo;
// "replace", "location", "open", "banner-open"
var linkWindow;
var windowTools = "toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes";

const MECHANIC_CONFIG = {
  // This is not the intro splash screen
  directions: {
    show: false,
    names: ['directions_0.png'],
  },
  pieces: {
    columns: 3,
    rows: 3,
  },
  targets: {
    // Can be array
    x: 76,
    y: 76,
  },
  // Supply = Where unused pieces live
  supply: {
    messy: false,
    x: 80,
    y: 420,
    // nice
    width: 480,
    height: 0,
  }
};

function init() {
  cb.utils.ensureSynchronousConfig().then(()=>Object.assign(MECHANIC_CONFIG, CATA_CONFIG.mechanic)).then(cb.canvas.prepare).then((s)=>{
    stage = s;
    createjs.Touch.enable(s);
    addPickTrackForm();
    addPreload();
    // FUNC in form_styler.js
    setSpecs();
    const pick = selectPuzzle();
    prepareDirections(manifest, MECHANIC_CONFIG.directions, pick);
  }
  ).then(()=>cb.manifest.load(manifest, imgpath)).then((q)=>{
    queue = q;
    loadComplete();
  }
  ).then(()=>cb.canvas.doIntroSplash(stage)).then(()=>doDirections(stage)).then(showPieces);
}

function loadComplete() {
  iconContainer = new createjs.Container();
  stage.addChild(iconContainer);

  for (let i = 0; i < manifest.length; i++) {
    if (manifest[i].class == "puzzle") {
      stagePuzzle(queue.getResult(manifest[i].src));
    }
    if (manifest[i].class == "skin") {
      addSkin(i)
    }
    if (manifest[i].class == "timer") {
      addTimer(i)
    }
    if (manifest[i].class == "exit") {
      addExit(i)
    }
    if (manifest[i].class == "finish") {
      addFinish(i)
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

function stagePuzzle(img) {
  const {pieces, supply, targets} = MECHANIC_CONFIG;

  // Guh
  minimumScore = pieces.rows * pieces.columns;

  const columnWidth = img.width / pieces.columns;
  const rowHeight = img.height / pieces.rows;
  const startingSupplyPositions = createStartingPositions(minimumScore, columnWidth, rowHeight, supply.x, supply.y, supply.width, supply.height);

  for (let i = 0; i < pieces.rows; i++) {
    for (let j = 0; j < pieces.columns; j++) {
      const bmp = new createjs.Bitmap(img);
      bmp.visible = false;
      stage.addChild(bmp);
      bmp.cache(columnWidth * j, rowHeight * i, columnWidth, rowHeight);
      const bmpSrc = bmp.cacheCanvas;

      const index = i * pieces.columns + j;
      const introX = supply.messy ? supply.x + Math.round(supply.width * Math.random()) : startingSupplyPositions[index].x;
      const introY = supply.messy ? supply.y + Math.round(supply.height * Math.random()) : startingSupplyPositions[index].y;
      const xTarget = targets.length ? targets[index].x + (columnWidth / 2) : targets.x + (columnWidth / 2) + columnWidth * j;
      const yTarget = targets.length ? targets[index].y + (rowHeight / 2) : targets.y + (rowHeight / 2) + rowHeight * i;
      const place = (index + 1).toString();

      stagePiece(bmpSrc, introX, introY, xTarget, yTarget, place, true);
    }
  }
}

function stagePiece(bmpSrc, introX, introY, xTarget, yTarget, place, key) {
  var thisIndex = iconList.length;

  const bmp = new createjs.Bitmap(bmpSrc);
  bmp.regX = Math.round(bmp.image.width * 0.5);
  bmp.regY = Math.round(bmp.image.height * 0.5);
  bmp.homeX = bmp.x = introX;
  bmp.homeY = bmp.y = introY;
  //target when drag-dropped wrong place
  bmp.xtarget = xTarget;
  bmp.ytarget = yTarget;
  bmp.indextarget = -1;
  bmp.key = key;
  bmp.place = place;
  bmp.draggable = true;
  bmp.alpha = 0;
  bmp.index = thisIndex;
  //pctIndex;
  bmp.shadow = new createjs.Shadow('#000',2,2,10);
  iconContainer.addChild(bmp);
  bmp.addEventListener("pressmove", iconPressDown);
  bmp.addEventListener("pressup", iconPressUp);
  iconList.push(bmp);

  // scramble layering
  var randomIndex = Math.round(thisIndex * Math.random());
  iconContainer.setChildIndex(bmp, randomIndex);

  xTargetList.push(bmp.xtarget);
  yTargetList.push(bmp.ytarget);
  openTargetList.push(true);
  choiceList.push("*");
}

function iconClick(event) {
  iconIndex = event.target.index;
}

function iconPressDown(event) {
  iconIndex = event.target.index;

  if (firstIconDrag == false) {
    // send logEngagement game-start of 1st event drag
    if (exitlinks[0].engagepath != "none" && gameEngaged == false) {
      logEngagement("game-start");
    }
    firstIconDrag = true;
  }

  if (iconList[iconIndex].draggable == true && exitDisplayed == false) {
    clickCount += 1;
    iconList[iconIndex].x = event.stageX;
    iconList[iconIndex].y = event.stageY;
    var dx = iconList[iconIndex].x - iconList[iconIndex].xtarget;
    var dy = iconList[iconIndex].y - iconList[iconIndex].ytarget;
    iconList[iconIndex].dist = Math.sqrt(dx * dx + dy * dy);
  }

  if (iconList[iconIndex].draggable == true && iconList[iconIndex].y < yDropMax) {
    //top of stack when dragging
    var zTopIndex = iconContainer.children.length - 1;
    iconContainer.setChildIndex(iconList[iconIndex], zTopIndex);
  }

  // set target position to available (openTargetList[?] = true )
  if (iconList[iconIndex].indextarget > -1 && exitDisplayed == false) {
    var thisIndex = iconList[iconIndex].indextarget
    openTargetList[thisIndex] = true;
    iconList[iconIndex].indextarget = -1;
  }
  iconList[iconIndex].shadow = new createjs.Shadow('#000',2,2,10);

  if (timeCount == timeMax) {
    startTimer();
  }
}

function iconPressUp(event) {

  iconList[iconIndex].x = iconList[iconIndex].xtarget;
  iconList[iconIndex].y = iconList[iconIndex].ytarget;
  iconList[iconIndex].dist = 0;

  switch (targetMatch) {
  case "open":
    checkOpenTargets();
    // lock or drop to ANY available postion
    break;
  default:
    checkStrictTagets();
    // lock or drop to SPECIFIC posItion
  }
  // end switch targetMatch

}
// end iconPressUp

function checkStrictTagets() {

  var isSetIcon = false;

  if (iconList[iconIndex].dist < minimumDist && iconList[iconIndex].key == true) {
    // LOG NEW PLACE POSITION IN CHOICELIST
    isSetIcon = true;
    choiceList[iconIndex] = iconList[iconIndex].place;
  }
  // end if
  if (isSetIcon) {
    setIcon();
    //TWEEN TO FINAL POSTION = CORRECT
  } else {
    dropIcon();
    // TWEEN TO GROUND = NOT CORRECT
  }
  // end if/else
}

function checkOpenTargets() {

  // DELETE PREVIOUS LOCATION OF PLACE IN CHOICELIST
  var thisPlace = iconList[iconIndex].place;
  var indexCheck = choiceList.indexOf(thisPlace);
  if (indexCheck > -1) {
    choiceList[indexCheck] = "*";
  }
  /**/

  // set new target if open version
  for (i = 0; i < xTargetList.length; i++) {
    var dx = iconList[iconIndex].x - xTargetList[i];
    var dy = iconList[iconIndex].y - yTargetList[i];
    var thisDist = Math.sqrt(dx * dx + dy * dy);
    if (targetMatch == "open" && thisDist < minimumDist && openTargetList[i] == true) {
      iconList[iconIndex].xtarget = xTargetList[i];
      iconList[iconIndex].ytarget = yTargetList[i];
      iconList[iconIndex].dist = thisDist;
      iconList[iconIndex].indextarget = i;
      openTargetList[i] = false;
      choiceList[i] = iconList[iconIndex].place;

      setIcon();
      // console.log("checkOpenTargets = " + i + " - " + iconList[iconIndex].dist)
    }
    // end if
  }
  // end for

  if (iconList[iconIndex].dist > minimumDist) {
    dropIcon();
  }

  checkPositions();

}
// end checkOpenTargets()

function setIcon() {
  //TWEEN TO FINAL POSTION = CORRECT
  var thisX = iconList[iconIndex].xtarget;
  var thisY = iconList[iconIndex].ytarget;
  createjs.Tween.get(iconList[iconIndex]).to({
    x: thisX,
    y: thisY
  }, 300, createjs.Ease.elasticOut);
  createjs.Tween.get(iconList[iconIndex].shadow).to({
    offsetX: 0,
    offsetY: 0,
    blur: 0
  }, 300, createjs.Ease.elasticOut);
  checkPositions();
}

function dropIcon() {
  // TWEEN TO GROUND = NOT CORRECT
  var thisTime = dropTime - Math.round(iconList[iconIndex].dist);
  var thatX = MECHANIC_CONFIG.supply.x + Math.round(MECHANIC_CONFIG.supply.width * Math.random());
  var thatY = iconList[iconIndex].homeY;
  //360; // 420
  if (iconList[iconIndex].y > yDropMax) {
    // reset thatX for small tween if drop is very short
    var directionList = [-1, 1, -1, 1];
    var directionIndex = Math.floor(Math.random() * directionList.length);
    thatX = (iconList[iconIndex].regX * Math.random() * directionList[directionIndex]) + iconList[iconIndex].x;
  }
  if (thatX < MECHANIC_CONFIG.supply.x || thatX > (MECHANIC_CONFIG.supply.x + MECHANIC_CONFIG.supply.width)) {
    // if x could place icon off the screen, just use current x postion
    thatX = iconList[iconIndex].x;
  }

  if (MECHANIC_CONFIG.supply.width < MECHANIC_CONFIG.supply.height) {
    // if the puzzle is vertical
    thatX = MECHANIC_CONFIG.supply.x;
  }

  if (!MECHANIC_CONFIG.supply.messy) {
    thatX = iconList[iconIndex].homeX
  }

  createjs.Tween.get(iconList[iconIndex]).to({
    y: thatY
  }, thisTime, createjs.Ease.bounceOut).to({
    x: thatX
  }, dropTimeX, createjs.Ease.sineInOut);
}

function checkPositions() {
  var thisScore = 0;

  for (i = 0; i < iconList.length; i++) {
    if (iconList[i].dist < minimumDist && iconList[i].key == true) {
      thisScore += 1;
    }
  }

  scoreIndex = thisScore;

  // var targetMatch =gamespecs[0].targetmatch; // "strict", or "open"

  if (scoreIndex >= minimumScore && targetMatch != "open") {
    hideFalseIcons();
    showExit();
  }

  if (scoreIndex >= minimumScore && targetMatch == "open") {
    var tween00 = createjs.Tween.get(finishList[0]).to({
      alpha: 1
    }, 500, createjs.Ease.sineOut)
  }

}

function hideFalseIcons() {
  for (i = 0; i < iconList.length; i++) {
    if (iconList[i].key == false) {
      var tween00 = createjs.Tween.get(iconList[i]).to({
        alpha: 0
      }, 500, createjs.Ease.sineOut);
    }
  }
}

function showExit() {

  if (exitDisplayed == false) {

    var thisExitClass = exitlinks[0].gateclass;

    switch (thisExitClass) {
    case "multiexit":
      exitIndex = scoreIndex;
      break;
    case "winlevel":
      exitIndex = winlevel;
      break;
    case "score":
      if (scoreIndex < minimumScore) {
        exitIndex = 0;
      } else {
        exitIndex = 1;
      }
      break;
    default:
      exitIndex = winlevel;
    }
    // end gateclass switch

    if (gameclass != "test" && gameclass != "live") {
      console.log(thisExitClass + " scoreIndex" + scoreIndex + " exitIndex=" + exitIndex);
    }

    exitDisplayed = true;
    timeCount = 0;
    var thisPause = exitList[exitIndex].pause;
    var thisTime = exitList[exitIndex].time;
    var targetY = exitList[exitIndex].y;
    exitList[exitIndex].y += exitList[exitIndex].offset;

    exitList[exitIndex].visible = true;
    var tween00 = createjs.Tween.get(exitList[exitIndex]).call(enterChoice).wait(thisPause).call(doAutoGateway).to({
      alpha: 1,
      y: targetY
    }, thisTime, exitTweenIn);

    for (i = 0; i < iconList[i].length; i++) {
      iconList[i].removeAllEventListeners();
      iconList[i].removeEventListener("pressmove");
      iconList[i].removeEventListener("pressup");
    }

    //mark the current play as played on server
    if (gameclass == "test" || gameclass == "live") {
      //$.get(document.URL + "/scratch");
      if (!CATA_CONFIG?.general?.allowRepeatPlay) {
        $.get(document.URL.split('?')[0] + '/scratch');
      }
    }

    // social display, or not, on winlevel
    var showThis = exitlinks[0].showsocial;
    var socialShowList = showThis.split("|");

    if (socialShowList[winlevel] == "true") {
      $("#boomSocial").delay(1000).fadeIn();
    }

  }
  // if exitDisplayed end

}
// showExit() End

function addExit(pctIndex) {
  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.alpha = 0;
  bmp.visible = false;
  bmp.offset = manifest[pctIndex].offset;
  bmp.index = exitList.length;
  //pctIndex;
  bmp.cursor = "pointer";
  bmp.time = manifest[pctIndex].time;
  bmp.pause = manifest[pctIndex].pause;
  //pctIndex;
  stage.addChild(bmp);
  bmp.addEventListener("click", exitClick);
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

function addTimer(pctIndex) {

  var timerMask = new createjs.Shape();
  timerMask.graphics.drawRect(0, 0, manifest[pctIndex].offset, manifest[pctIndex].offset);
  timerMask.regX = (manifest[pctIndex].offset * 0.5);
  timerMask.x = manifest[pctIndex].x;
  timerMask.y = manifest[pctIndex].y;

  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.regX = Math.round(manifest[pctIndex].offset * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.offset = manifest[pctIndex].offset;
  bmp.alpha = 1;
  bmp.index = skinList.length;
  //pctIndex;
  stage.addChild(bmp, timerMask);
  bmp.mask = timerMask;
  timerList.push(bmp);
}

function startTimer() {
  // timer , targetMatch "strict"
  if (scoreIndex < minimumScore && timeCount > 0 && targetMatch == "strict") {
    timerList[0].alpha = 0
    timerList[0].y -= timerList[0].offset;
    timerList[0].scaleX = 0.1;
    var timer01 = createjs.Tween.get(timerList[0]).to({
      alpha: 1,
      scaleX: 1,
    }, 100, createjs.Ease.sineIn).wait(900).call(startTimer);

    timeCount -= 1;
  }

  // // timer, targetMatch "open"
  if (timeCount > 0 && targetMatch == "open") {
    timerList[0].alpha = 0
    timerList[0].y -= timerList[0].offset;
    timerList[0].scaleX = 0.1;
    var timer01 = createjs.Tween.get(timerList[0]).to({
      alpha: 1,
      scaleX: 1,
    }, 100, createjs.Ease.sineIn).wait(900).call(startTimer);

    timeCount -= 1;
  }

  if (timeCount == 0) {
    showExit();
  }
}

function addSkin(pctIndex) {
  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.alpha = 1;
  bmp.index = skinList.length;
  //pctIndex;
  stage.addChild(bmp);
  skinList.push(bmp);
}

function showPieces() {

  if (exitlinks[0].engagepath != "none" && gameEngaged == false) {
    logEngagement("game-start")
  }
  ;for (i = 0; i < iconList.length; i++) {
    var tween00 = createjs.Tween.get(iconList[i]).wait(introPause).to({
      alpha: 1
    }, introTime, createjs.Ease.sineOut);
  }
}

function addFinish(pctIndex) {
  var img = queue.getResult(manifest[pctIndex].src);
  var bmp = new createjs.Bitmap(img);
  bmp.regX = Math.round(manifest[pctIndex].width * 0.5);
  bmp.regY = Math.round(manifest[pctIndex].height * 0.5);
  bmp.x = manifest[pctIndex].x;
  bmp.y = manifest[pctIndex].y;
  bmp.alpha = 0;
  bmp.offset = manifest[pctIndex].offset;
  bmp.index = finishList.length;
  //pctIndex;
  bmp.cursor = "pointer";
  bmp.clicked = false;
  stage.addChild(bmp);
  bmp.addEventListener("click", finishClick);
  finishList.push(bmp);

  stage.setChildIndex(bmp, 0);
  // stage this bmp UNDER puzzle pieces

  //var tween00 = createjs.Tween.get(finishList[0]).to({alpha:1}, 500, createjs.Ease.sineOut);
}

function finishClick(event) {
  var isClicked = finishList[0].clicked;
  var thisY = finishList[0].y;
  var targetY = finishList[0].y + finishList[0].offset;
  if (isClicked == false) {
    finishList[0].clicked = true;
    var tween00 = createjs.Tween.get(finishList[0]).to({
      y: targetY
    }, 200, createjs.Ease.sineOut).to({
      y: thisY
    }, 200, createjs.Ease.sineOut).call(hideFalseIcons).call(showExit);
  }

}

/* ------[ CONTROLS END ]------ */

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

/* ::::::::::: [ AUTOGATEWAY CONTROLS START ] :::::::::: */
/* ::::::::::: [ AUTOGATEWAY CONTROLS START ] :::::::::: */

function doAutoGateway() {
  if (hasAutoGateway == true) {

    autoGateIndex = exitIndex;
    // exitIndex
    var thisTime = autoGateTimeList[autoGateIndex];

    switch (thisTime) {
    case 0:
      hasAutoGateway = true;
      exitList[autoGateIndex].visible = false;
      // hide exit button
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

/* :::::::::: [ UTILITY FUNCTIONS START ] ::::::::::: */

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
    txt.x = Math.round(stage.canvas.width * 0.5);
    txt.y = stage.canvas.height - 24;
    txt.alpha = 0.6;
    txt.textAlign = "center";
    txt.shadow = new createjs.Shadow("#000000",2,2,1);
    stage.addChild(txt);
  }
  //end switch

  if (exitlinks[0].social && exitlinks[0].social != "none") {
    // place holder function form generator templates, function in social.js
    addSocialCss();
    // in social.js
  }

}

function addPickTrackForm() {
  var thisForm = "<form class='collapse' id='choiceForm'><input name='upshotpath' id='upshotpath' class='form-control' value=''></form>";
  $('body').append(thisForm);
  /**/

  // CHANGE LOADQEUE BOOLEAN IF LIVE GAME
  thisUrl = window.location.href;
  isFile = thisUrl.match(/file:/);
  if (isFile == "file:") {
    loadQueueLive = false;
  }

  if (gateClass != gateStyle && gateClass != "none") {
    //match gateClass to gateStyle if live game...
    gateStyle = gateClass;
  }
  // end gateStyle if condition

}

function setSpecs() {
  var pngIndex = 0;

  if (exitlinks[0].autogateway) {
    // formate arrays for autoGateway
    specAutoGateway();
  }
  // end autogateway if

  // set exit graphic
  var exitCount = -1;
  for (i = 0; i < manifest.length; i++) {
    if (manifest[i].class == "exit") {
      exitCount += 1;
      switch (gateStyle) {
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
        if (exitCount > 0) {
          manifest[i].src = "spacer1x1canvas.png"
        }
        ;break;
      case "multiexit":
        gateStyle = gateStyle;
        break;
      default:
        gateStyle = gateStyle;
      }
      // end switch
      if (hasAutoGateway == true && autoGateTimeList[exitCount] == 0) {
        manifest[i].src = "spacer1x1canvas.png";
      }
    }
    // end if eixt
  }
  // end for loop

}

/* :::::::::: [ UTILITY FUNCTIONS END ] ::::::::::: */

/* ::::::::: [ AJAX START ] :::::::::: */

function enterChoice() {

  $('#upshotpath').val(choiceList);

  if (gameclass == "test" || gameclass == "live") {
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

// check for click tag
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
  ;var thisGateClass = exitlinks[0].gateclass;
  var scoreString = scoreIndex.toString();

  var lastChoice = choiceList.length - 1;
  var thisScore = scoreIndex;
  var thisResult = scoreIndex;

  var exitspecs = {
    gameclass: thisGateClass,
    picklist: choiceList,
    score: thisScore,
    exit: scoreString,
    result: thisResult,
  };

  switch (thisGateClass) {
  case "score":
    if (scoreIndex >= minimumScore) {
      exitspecs.score = 1;
      exitspecs.exit = "1";

    } else {
      exitspecs.score = 0;
      exitspecs.exit = "0";
    }
    break;
  case "multiexit":
    if (scoreIndex < 11) {
      exitspecs.score = scoreIndex;
    } else {
      exitspecs.score = 10;
    }
    break
  default:
    thisGateClass = thisGateClass;
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

/* ::::::::: [ AJAX START ] :::::::::: */

//Need when having animation.
function handleTick(event) {
  stage.update();
}

function selectPuzzle() {
  const puzzles = manifest.filter((img)=>img.class === 'puzzle');
  if (puzzles.length == 1) {
    return 0;
  }
  let pick = winlevel;
  if (gamespecs[0].gatestyle !== 'winlevel') {
    pick = Math.round(puzzles.length * Math.random());
  }
  // Remove all the puzzles, and put our pick back
  manifest = manifest.filter((img)=>img.class !== 'puzzle');
  manifest.unshift(puzzles[pick]);
  return pick;
}

function prepareDirections(manifest, config, pick) {
  if (config?.show) {
    config.name = config.names[pick];
    manifest.push({
      src: config.name,
      class: "directions"
    });
  }
}

async function doDirections(stage) {
  if (MECHANIC_CONFIG.directions?.show) {
    await new Promise((resolve=>setTimeout(resolve, MECHANIC_CONFIG.directions.delay)));
    await cb.canvas.doSplash(stage, cb.manifest.getImage(MECHANIC_CONFIG.directions.name), MECHANIC_CONFIG.directions);
  }
}

function createStartingPositions(pieceCount, pieceHeight, pieceWidth, x, y, width, height) {
  var wide = width > height;
  var result = [];
  x += pieceWidth / 2;
  y += pieceHeight / 2;

  // If Rectangle
  if ((wide && height > pieceHeight) || (!wide && width > pieceWidth)) {
    result = staggerStartingPositions(pieceCount, x, y, width, height);
  } else {
    // A line
    for (var i = 0; i < pieceCount; i++) {
      result.push({
        x: x + (wide ? (i * Math.round(width / pieceCount)) : 0),
        y: y + (wide ? 0 : (i * Math.round(height / pieceCount)))
      });
    }
  }

  return shuffle(result);
}

function staggerStartingPositions(pieceCount, x, y, width, height) {
  var result;
  var wide = width > height;

  var long = Math.ceil(Math.sqrt(pieceCount / 2)) + 1;
  var short = Math.ceil(pieceCount / (2 * long - 1));
  if (long * short + (long - 1) * (short - 1) < pieceCount) {
    short++;
  }
  var rows = wide ? short : long;
  var cols = wide ? long : short;

  var colWidth = Math.round(width / cols);
  var rowHeight = Math.round(height / rows);
  result = startingGrid(rows, cols, x + Math.round(colWidth / 2), y + Math.round(rowHeight / 2), width, height);
  var innerGrid = startingGrid(rows - 1, cols - 1, x + colWidth, y + rowHeight, width - colWidth, height - rowHeight);
  shuffle(innerGrid);
  while (result.length < pieceCount) {
    result.push(innerGrid.pop());
  }

  return result;
}

function startingGrid(rows, cols, x, y, width, height) {
  var result = [];
  var colWidth = Math.round(width / cols);
  var rowHeight = Math.round(height / rows);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      result.push({
        x: x + i * colWidth,
        y: y + j * rowHeight
      });
    }
  }
  return result;
}

/**
 * Durstenfeld
 * @param arr
 * @returns {*}
 */
function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr;
}
