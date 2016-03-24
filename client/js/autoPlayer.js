(function(){
  'use strict'
   window.AutoPlayer = (function(){
     function autoPlayer(elem,video){
       this.elem = elem;
       this.video = video;
       console.log(this.elem.length);
     };
     var isScrolledIntoView = function(videos,wtop,wheight,toPix){
       var scrollTop = wtop + toPix;
       var scrollBottom = wtop+wheight-toPix;
       videos.each(function(index,el){
         var media = $(this)[0].getBoundingClientRect();
         console.log(media);
       });

     };
     autoPlayer.prototype.bindWindowScroll = function($document){
       var $that = this;
       $document.on('scroll',function(){
         isScrolledIntoView($that.video,$(this).scrollTop(),$(this).height(),40);
       });
     }
     return autoPlayer;
   })();
}).call(this);;
