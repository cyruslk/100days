var streamIds = [];
var posts = [];

function init(callback){
  var streams = [document.getElementById('substream_0')];
  streams.push(streams[0].nextSibling);
  for (var i = 0; i < streams.length; i++){
    observeStream(streams[i], callback);
    streamIds.push(streams[i].id);
  }

  var pagelet = streams[0].nextSibling.nextSibling.children[0];
  observePagelet(pagelet, callback);
}

function observePagelet(elt, callback){
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var streams = $('._4ikz');
      for (var i = 0; i < streams.length; i++){
        if (streamIds.indexOf(streams[i].id) == -1){
          observeStream(streams[i], callback);
          streamIds.push(streams[i].id);
        }
      }
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };

  observer.observe(elt, config);
}

function observeStream(elt, callback){

  function stopObserving(){
    observer.disconnect();
    callback(elt);
  }

  var timeout;
  function setDelay(){
    clearTimeout(timeout);
    timeout = setTimeout(stopObserving, 500);
  }

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true
  };

  var observer = new MutationObserver(function (mutations) {
    setDelay();
  });

  setDelay();
  observer.observe(elt, config);
}

function gatherPosts(stream){
  posts = $.merge(posts, $(stream).find("[id*='hyperfeed_story_id_']"));
  visiblePosts();
}

$(window).scroll(function (){
  visiblePosts();
});

function visiblePosts(){
  for (var i = 0; i < posts.length; i++){
    isVisible(posts[i]);
  }
}

function isVisible(post){
  var windowTop = $(window).scrollTop();
  var windowHeight = $(window).height();
  var windowBottom = windowTop + windowHeight;
  var windowCenter = windowTop + ((windowBottom - windowTop) / 2);

  var eltTop = $(post).offset().top;
  var eltBottom = eltTop + $(post).height();
  var eltCenter = eltTop + ((eltBottom - eltTop) / 2);

  if (eltTop < (windowBottom - windowHeight / 4) && eltTop >= windowCenter){
    num = eltTop - windowCenter;
    var opVal = num.map(0, ((windowBottom - windowHeight / 4) - windowCenter), 0, 1);
    post.setAttribute('style', 'opacity:' + opVal + ';');
  } else if (eltTop < windowCenter && eltBottom > windowCenter){
    post.setAttribute('style', 'opacity: 0;');
  } else if (eltBottom < windowCenter && eltBottom > (windowTop + windowHeight/4)){
    num = windowCenter - eltBottom;
    var opVal = num.map(0, (windowCenter - (windowTop + windowHeight/4)), 0, 1);
    post.setAttribute('style', 'opacity:' + opVal + ';');
  }
}

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

init(gatherPosts);
