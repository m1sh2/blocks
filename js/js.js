'use strict';

var score = $('#score');
var scoreNum = 0;
var fa = [];
var xStart = 80;
var yStart = 0;
var step = 20;
var el;
var elId = 0;
var sound = 1;
var pause = 0;
var next = Rand(1,7);



var grid = {};
var t;
var map = $('#map');
var debugItems = $('#debug #items');
var debugXY = $('#debug #xy');
var area = $('#area')[0];
var ctx = area.getContext("2d");
const conf = {
  w: 20,
  h: 20,
  x: 100,
  y: 0,
  speed: 1000,
  wa: area.width,
  ha: area.height
};
var xyCoords = [];
var yCoords = [];
var items = [];
// var w = 20;
// var h = 20;

// var blocks = {
//   rect: {
//     item: (function() {
//       var color = 'rgba(0, 0, 200, 0.5)';
      
//       return item;

//       // return items;
//       // ctx.fillStyle = item.color;
//       // ctx.fillRect (item.x, item.y, item.w, item.h);
//       // ctx.fillStyle = item.color;
//       // ctx.fillRect (item.x, item.y, item.w, item.h);
//       // ctx.fillStyle = item.color;
//       // ctx.fillRect (item.x, item.y, item.w, item.h);
//       // ctx.fillStyle = item.color;
//       // ctx.fillRect (item.x, item.y, item.w, item.h);

//       // ctx.beginPath();
//       // ctx.lineWidth = 0.1;
//       // ctx.moveTo(item.x, item.y);
//       // ctx.lineTo(item.x + w, item.y);
//       // ctx.lineTo(item.x + w, item.y + h);
//       // ctx.lineTo(item.x, item.y + h);
//       // ctx.lineTo(item.x, item.y);
//       // ctx.stroke();
//     })(),
//     coords: (function(argument) {
      
//     })()
// };




function Params(type) {
  
  return params[type];
}

function Item(type) {
  var params = {
    rect: {
      color: 'rgba(0, 0, 200, 0.5)',
      state: 'new'
    }
  };

  var x = conf.x;
  var y = conf.y;
  var w = conf.w;
  var h = conf.h;
  var id = sid();
  var state = 'new';
  // console.info(items, this.items);
  var coords = {
    rect: {
      id: id,
      color: params[type].color,
      state: params[type].state,
      near: false,
      xmin: x - w,
      xmax: x,
      ymin: y,
      ymax: y + h,
      xs: [x, x - w],
      ys: [y, y + h],
      coords: [
        {
          x: x - w,
          y: y,
          w: w,
          h: h
        },
        {
          x: x,
          y: y,
          w: w,
          h: h
        },
        {
          x: x - w,
          y: y + h,
          w: w,
          h: h
        },
        {
          x: x,
          y: y + h,
          w: w,
          h: h
        }
      ]
    }
  };
  xyCoords = xyCoords.concat([{x: x, y: y}, {x: x - w, y: y}, {x: x - w, y: y + h}, {x: x, y: y + h}]);
  // yCoords = yCoords.concat([y, y + h]);
  return coords[type];
}





// items = items.push(Item('rect'));

// itemsCoords.push(blocks['rect'].coords);

// var x = 0,
//   y = 0,
//   w = 20,
//   h = 20;
// for (var i = 0; i < 25; i++) {
  
//   items.push({
//     type: 'rect'
//   });

//   if (x >= 180) {
//     x = 0;
//     y += 20;
//   } else {
//     x += 20;
//   }
// }

// KeyUp();

function Update() {
  // var w = conf.w;
  // var h = conf.h;
  if (items.length) {
    var newItem = false;
    var itemNear = false;
    for (var i = 0; i < items.length; i++) {
      // console.info(newItem, items[i].params.state);
      var item = items[i];
      var id = item.id;
      
      // for (var j = 0; j < item.coords.length; j++) {
      //   var x = item.coords[j].x;
      //   var y = item.coords[j].y;
      //   var w = item.coords[j].w;
      //   var h = item.coords[j].h;
      //   if (y + h >= conf.ha && item.state === 'new') {
      //     newItem = true;
      //     item.state = 'old';
      //   }
      // }



      for (var j = 0; j < item.coords.length; j++) {
        if (xyCoords.indexOf({x: item.coords[j].x, y: item.coords[j].y + conf.h}) > -1) {
          item.near = true;
        }
        // var x = item.coords[j].x;
        // var y = item.coords[j].y;
        // var w = item.coords[j].w;
        // var h = item.coords[j].h;
        // item.coords[j].y += conf.h;
        // xCoords.push(item.coords[j].x);
        // yCoords.push(item.coords[j].y);
      }

      console.info(item.ymax, item.near, item.state, item.id);

      if (item.state === 'new' && item.ymax < conf.ha && !item.near) {
        
        item.ymax += conf.h;
        for (var j = 0; j < item.coords.length; j++) {
          // var x = item.coords[j].x;
          // var y = item.coords[j].y;
          // var w = item.coords[j].w;
          // var h = item.coords[j].h;
          xyCoords.splice(xyCoords.indexOf({x: item.coords[j].x, y: item.coords[j].y}), 1);
          item.coords[j].y += conf.h;
          xyCoords.push({x: item.coords[j].x, y: item.coords[j].y});
          // yCoords.push(item.coords[j].y);
        }
      } else if (item.state === 'new' && (item.ymax >= conf.ha || item.near)) {
        newItem = true;
        item.state = 'old';
      }
    }
    if (newItem) {
      items.push(Item('rect'));
      newItem = false;
    }
  } else {
    items.push(Item('rect'));
  }
  
  // console.info(newItem);
}

function Draw(move) {
  // var w = conf.w;
  // var h = conf.h;
  move = typeof move === 'undefined' ? false : move;
  // console.info(move);
  if (move) {
    Update();
  }

  // if (area.getContext) {
    // var x = 0,
    //   y = 0,
    //   w = 20,
    //   h = 20;
    // for (var i = 0; i < 25; i++) {
      
    //   items.push({
    //     type: 'rect',
    //     x: x,
    //     y: y,
    //     w: w,
    //     h: h,
    //     color: 'rgba(0, 0, 200, 0.5)'
    //   });

    //   if (x >= 180) {
    //     x = 0;
    //     y += 20;
    //   } else {
    //     x += 20;
    //   }
    // }
    
    // var ctx = area.getContext("2d");

  ctx.clearRect(0, 0, area.width, area.height);
  Grid();
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    // var coords = items[i].coords[j];
    // var params = items[i].params;
    var id = item.id;
    // console.info(item);
    for (var j = 0; j < item.coords.length; j++) {
      var x = item.coords[j].x;
      var y = item.coords[j].y;
      var w = item.coords[j].w;
      var h = item.coords[j].h;
      // var item = blocks[items[i].type].get();
      // console.info(item, x, y, w, h);
      // blocks[item.type].draw(item.x, item.y, item.w, item.h);
      ctx.fillStyle = item.color;
      ctx.fillRect (x, y, w, h);

      ctx.beginPath();
      ctx.lineWidth = 0.1;
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
  // }
}

function Grid(move) {
  // var w = conf.w;
  // var h = conf.h;
  move = typeof move === 'undefined' ? false : move;
  // console.info(move);
  if (move) {
    Update();
  }

  ctx.clearRect(0, 0, area.width, area.height);
  
  for (var i = 0; i < conf.wa; i = i + conf.w) {
    
    for (var j = 0; j < conf.ha; j = j + conf.h) {
      ctx.beginPath();
      ctx.lineWidth = 0.1;
      ctx.moveTo(i, j);
      ctx.lineTo(i + conf.w, j);
      ctx.lineTo(i + conf.w, j + conf.h);
      ctx.lineTo(i, j + conf.h);
      // ctx.lineTo(i, j);
      ctx.stroke();
    }
  }
  // }
}

function Go() {
  clearTimeout(t);
  Draw(true);
  debugItems.html(items.length);
  debugXY.html(xyCoords.length);
  t = setTimeout(function() {
    Go();
  }, conf.speed);
}

$(document).ready(function(){
  // var canvas = document.getElementById("canvas");
  // if (canvas.getContext) {
  //   var ctx = canvas.getContext("2d");

  

  // Grid();
  // }
  // NewEl();
  // Next();
  // Draw();
  Go();
  // $('button').click(function(){
  //   switch($(this).attr('act')){
  //     case 'restart':{
  //       clearTimeout(t);
  //       speed = speedDefault;
  //       $('#map').html('');
  //       $('#finishmessage').hide();
  //       NewEl();
  //       Go();
  //       break;
  //     }
  //     case 'sound':{
  //       sound = sound==0?1:0;
  //       if(sound==0){
  //         $('#control button[act="sound"]').addClass('mute');
  //       }
  //       else{
  //         $('#control button[act="sound"]').removeClass('mute');
  //       }
  //       break;
  //     }
  //     case 'pause':{
  //       pause = pause==0?1:0;
  //       if(pause==1){
  //         clearTimeout(t);
  //         $('#pausemessage').show();
  //         $(document).unbind('keyup');
  //       }
  //       else{
  //         $('#pausemessage').hide();
  //         KeyUp();
  //         speed = speedDefault;
  //         Go();
  //       }
  //       break;
  //     }
  //     case 'left':{
  //       Left();
  //       break;
  //     }
  //     case 'right':{
  //       Right();
  //       break;
  //     }
  //     case 'up':{
  //       Rotate();
  //       break;
  //     }
  //     case 'down':{
  //       Down();
  //       break;
  //     }
  //   }
    
  // });
});

function KeyUp(){
  $(document).keyup(function(e){
    if(e.keyCode==37){
      Left();
    }
    if(e.keyCode==39){
      Right();
    }
    if(e.keyCode==38){
      Rotate();
    }
    if(e.keyCode==40){
      Down();
    }
  });
}

function Left(){
  var xMin = 200;
  $('#map .el-'+elId).each(function(){
    if(parseInt($(this).css('left'))<xMin){
      xMin = parseInt($(this).css('left'));
    }
  });
  var xNew = step;
  if(xMin-step<0){
    xNew = 0;
  }
  if(!CheckEl('left')){
    $('#map .el-'+elId).css({
      left: '-='+xNew+'px'
    });
  }
}

function Right(){
  var xMax = 0;
  $('#map .el-'+elId).each(function(){
    if(parseInt($(this).css('left'))>xMax){
      xMax = parseInt($(this).css('left'));
    }
  });
  var xNew = step;
  if(xMax+step>180){
    xNew = 0;
  }
  if(!CheckEl('right')){
    $('#map .el-'+elId).css({
      left: '+='+xNew+'px'
    });
  }
}

function Rotate(){
  var el = $('#map .el-'+elId);
  switch(el.attr('type')){
    case '1':{
      
      break;
    }
    case '2':{
      switch(el.attr('rotate')){
        case '1':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==1){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==2){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==3){
              $(el).css({
                top: '-='+(step*2)+'px',
                left: '+='+(step*2)+'px'
              });
            }
          });
          el.attr('rotate',2);
          break;
        }
        case '2':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==1){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==2){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==3){
              $(el).css({
                top: '+='+(step*2)+'px',
                left: '-='+(step*2)+'px'
              });
            }
          });
          el.attr('rotate',1);
          break;
        }
      }
      break;
    }
    case '3':{
      switch(el.attr('rotate')){
        case '1':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                left: '+='+(step*2)+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
          });
          el.attr('rotate',2);
          break;
        }
        case '2':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '+='+(step*2)+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
          });
          el.attr('rotate',3);
          break;
        }
        case '3':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                left: '-='+(step*2)+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
          });
          el.attr('rotate',4);
          break;
        }
        case '4':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '-='+(step*2)+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
          });
          el.attr('rotate',1);
          break;
        }
      }
      break;
    }
    case '4':{
      switch(el.attr('rotate')){
        case '1':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==1){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==2){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==3){
              $(el).css({
                top: '-='+(step*2)+'px'
              });
            }
          });
          el.attr('rotate',2);
          break;
        }
        case '2':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==1){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==2){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==3){
              $(el).css({
                top: '+='+(step*2)+'px'
              });
            }
          });
          el.attr('rotate',1);
          break;
        }
      }
      break;
    }
    case '5':{
      switch(el.attr('rotate')){
        case '1':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==1){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==2){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==3){
              $(el).css({
                top: '-='+(step*2)+'px'
              });
            }
          });
          el.attr('rotate',2);
          break;
        }
        case '2':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==1){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==2){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==3){
              $(el).css({
                top: '+='+(step*2)+'px'
              });
            }
          });
          el.attr('rotate',1);
          break;
        }
      }
      break;
    }
    case '6':{
      switch(el.attr('rotate')){
        case '1':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '+='+(step*2)+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
          });
          el.attr('rotate',2);
          break;
        }
        case '2':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                left: '-='+(step*2)+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
          });
          el.attr('rotate',3);
          break;
        }
        case '3':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '-='+(step*2)+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
          });
          el.attr('rotate',4);
          break;
        }
        case '4':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                left: '+='+(step*2)+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
          });
          el.attr('rotate',1);
          break;
        }
      }
      break;
    }
    case '7':{
      switch(el.attr('rotate')){
        case '1':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
          });
          el.attr('rotate',2);
          break;
        }
        case '2':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
          });
          el.attr('rotate',3);
          break;
        }
        case '3':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '+='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
          });
          el.attr('rotate',4);
          break;
        }
        case '4':{
          $('#map .el-'+elId).each(function(i,el){
            if(i==0){
              $(el).css({
                top: '-='+step+'px',
                left: '+='+step+'px'
              });
            }
            if(i==1){
              $(el).css({
                top: '-='+step+'px',
                left: '-='+step+'px'
              });
            }
            if(i==2){
              // $(el).css({
              //   top: '-='+step+'px',
              //   left: '+='+step+'px'
              // });
            }
            if(i==3){
              $(el).css({
                top: '+='+step+'px',
                left: '+='+step+'px'
              });
            }
          });
          el.attr('rotate',1);
          break;
        }
      }
      break;
    }
  }
  var xMin = 0;
  $('#map .el-'+elId).each(function(){
    if(parseInt($(this).css('left'))<xMin){
      xMin = parseInt($(this).css('left'));
    }
  });
  if(xMin<0){
    $('#map .el-'+elId).css({
      left: '+='+(step*(Math.abs(xMin)/step))+'px'
    });
  }
  var xMax = 180;
  $('#map .el-'+elId).each(function(){
    if(parseInt($(this).css('left'))>xMax){
      xMax = parseInt($(this).css('left'));
    }
  });
  if(xMax>180){
    $('#map .el-'+elId).css({
      left: '-='+(step*((Math.abs(xMax)-180)/step))+'px'
    });
  }
}

function Down(){
  speed = 10;
  clearTimeout(t);
  Go();
}

function Go1(){
  if(Finish()){
    Sound('finish');
    $('#finishmessage').show();
  }
  else{
    if(CheckEl()){
      Line();
      NewEl();
      Next();
      Sound('down');
      speed = speedDefault;
    }
    else{
      $('#map .el-'+elId).css({
        top: '+='+step+'px'
      });
    }
    t = setTimeout(function(){Go();},speed);
  }
}

function CheckEl(direction){
  var r = 0;
  direction = typeof direction == 'undefined'?0:direction;
  $('#map .el-'+elId).each(function(){
    var el1 = $(this);
    var x1 = parseInt(el1.css('left'));
    var y1 = parseInt(el1.css('top'));
    
    if(y1==380){
      r = 1;
      return false;
    }
    if($('#map .el:not(.el-'+elId+')').length>0){
      $('#map .el:not(.el-'+elId+')').each(function(){
        var el0 = $(this);
        var x0 = parseInt(el0.css('left'));
        var y0 = parseInt(el0.css('top'));
        if(direction=='left'){
          if(y1==y0&&x0==x1-step){
            r = 1;
            return false;
          }
        }
        else if(direction=='right'){
          if(y1==y0&&x0==x1+step){
            r = 1;
            return false;
          }
        }
        else{
          if(y1+step==y0&&x0==x1){
            r = 1;
            return false;
          }
        }
      });
    }
  });
  if(r==1){
    return true;
  }
  return false;
}

function Finish(){
  var r = 0;
  $('#map .el-'+elId).each(function(){
    var el1 = $(this);
    var x1 = parseInt(el1.css('left'));
    var y1 = parseInt(el1.css('top'));
    if(CheckEl()&&y1==yStart){
      r = 1;
      return false;
    }
  });
  if(r==1){
    return true;
  }
  return false;
}

function Line(){
  var ln = 0;
  var lines = 0;
  for(var i=0;i<=380;i=i+step){
    if($('#map .el').filter(function(){return this.style.top == i+'px'}).length==10){
      $('#map .el').filter(function(){
        return this.style.top == i+'px'
      }).remove();
      $('#map .el').filter(function(){
        return parseInt(this.style.top)<i
      }).animate({
        top: '+='+step+'px'
      },200);
      lines++;
      ln = 1;
    }
    
  }
  if(ln==1){
    Sound('row');
    scoreNum += lines;
    score.html(scoreNum);
  }
}

function Sound(act){
  if(sound==1){
    document.getElementById(act).play();
  }
}


function NewEl(nxt){
  nxt = typeof nxt=='undefined'?0:nxt;
  var x = xStart;
  var y = yStart;
  var type = next;
  if(nxt==1){

  }
  else{
    elId++;
  }
  switch(type){
    case 2:{
      El(type,x,y,nxt);
      El(type,x,(y+step),nxt);
      El(type,x,(y+step+step),nxt);
      El(type,x,(y+step+step+step),nxt);
      break;
    }
    case 3:{
      El(type,x,y,nxt);
      El(type,x,(y+step),nxt);
      El(type,(x+step),(y+step),nxt);
      El(type,(x+step+step),(y+step),nxt);
      break;
    }
    case 4:{
      El(type,x,y,nxt);
      El(type,x,(y+step),nxt);
      El(type,(x+step),(y+step),nxt);
      El(type,(x+step),(y+step+step),nxt);
      break;
    }
    case 5:{
      El(type,(x+step),y,nxt);
      El(type,(x+step),(y+step),nxt);
      El(type,x,(y+step),nxt);
      El(type,x,(y+step+step),nxt);
      break;
    }
    case 6:{
      El(type,(x+step),y,nxt);
      El(type,(x+step),(y+step),nxt);
      El(type,x,(y+step),nxt);
      El(type,(x-step),(y+step),nxt);
      break;
    }
    case 7:{
      El(type,x,y,nxt);
      El(type,(x-step),(y+step),nxt);
      El(type,x,(y+step),nxt);
      El(type,(x+step),(y+step),nxt);
      break;
    }
    default:
    case 1:{
      El(type,x,y,nxt);
      El(type,(x+step),y,nxt);
      El(type,x,(y+step),nxt);
      El(type,(x+step),(y+step),nxt);
      break;
    }
  }
  return elId;
}

function El(type,x,y,nxt){
  var el = $('<div>');
  el.addClass('el');
  el.addClass('el-'+elId);
  el.addClass('el-type-'+type);
  el.attr('rotate',1);
  el.attr('type',type);
  if(nxt==1){
    $('#next').append(el);
  }
  else{
    $('#map').append(el);
  }
  el.css({
    top: y+'px',
    left: x+'px'
  });
}

function Next(){
  next = Rand(1,7);
  $('#next').html('');
  NewEl(1);
}

function Rand(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

// ​Array.prototype.diff = function(arr2) {
//     var ret = [];
//     for(i in this) {
//         if(arr2.indexOf( this[i] ) > -1){
//             ret.push( this[i] );
//         }
//     }
//     return ret;
// };

Object.defineProperty(Array, 'diff', {
  enumerable: false,
  get: function(arr2) {
    var ret = [];
    for(i in this) {
      if(arr2.indexOf( this[i] ) > -1){
        ret.push( this[i] );
      }
    }
    return ret;
  }
});











