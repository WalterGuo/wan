'use strict'

function isElement(o) {
  if (typeof HTMLElement === 'object') {
    return o instanceof HTMLElement;
  } else {
    return o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
  }
}
function isjQuery(obj) {
  return obj instanceof jQuery;
}
function playerModal(cls, obj) {
  var player, modal, play;
  player = void 0, modal = void 0;

  if (isElement(cls) === true) {
    player = $(cls);
  } else if (isjQuery(cls) === true) {
    player = cls;
  } else {
    return 0;
  }
  if (isElement(obj.$modal) === true) {
    modal = $(obj.$modal);
  } else if (isjQuery(obj.$modal) === true) {
    modal = obj.$modal;
  } else {
    modal = $('.modal');
  }
  var url = void 0;
  cls.on('click', function () {
    if (typeof obj.beforeCallBack === 'function') {
      obj.beforeCallBack();
    }
    url = $(this).data('venvy-player-url');
    play = new Iva('modalplayer', {
      video: url
    })
    modal.removeClass('hide').addClass('show');
  });
  $('.modal').unbind('click').on('click', function (e) {
    if ($(this).find('.modal-card').find(e.target).length > 0||$(e.target).hasClass('tip')||$(this).find('.modal-share-sidebar').find(e.target).length > 0) {

    }else{
      if(play){
        play.destroy();
      }
      $(this).removeClass('show').addClass('hide');
      $('#modalplayer').children().remove();
      if (typeof obj.afterCallBack === 'function') {
        obj.afterCallBack();
      }
    }

  })
}
