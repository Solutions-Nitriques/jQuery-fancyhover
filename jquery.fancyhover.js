/* 
* Part of Nitriques Solutions inc. (http://www.nitriques.com) jQuery plug-in bundle
* 
* Use this plugin to add a hover effects on some elements.
* The hover fades in and out when the mouse enter or leaves the selected elements
* 
* Liscence under the The Code Project Open License (CPOL)
* http://www.codeproject.com/info/cpol10.aspx

* Name: jquery.fancyhover.js
* Date: 2011-07-06
* Version: 1.2

* Pre-requisites: none;

* Version 1.2
* 	Added the useOuter setting: will take padding and borders into count
* 	Added the double events setting: will fire _in and _out on both the target and the div

* Version 1.1
* 	Added the possibility to pass options 
* 	CSS is now updated each time the hover is show to help usign this plugin in slideshows
 
* Version 1.0
* 	Initial version

*/
(function ($){
	
	var defaults = { 
		classname: 'ntr-fancybox-hover',
		durationIn: 300,
		durationOut: 200,
		color: null,
		opacity: 0.3,
		before: null,
		after: null,
		useOuter: false,
		
		// this will fire _in and _out on both the target and the div
		// usefull when passing before and/or after callbacks
		doubleEvents: true 
	};
	
	$.fn.extend({ // jQuery plugin
	    ntr$fancyhover: function(options) {

			var opts = $.extend({}, defaults, options);
			
			function _in(e) {
				var t = $(this),
					// div is added after t, so we used the first next slibling
					div = t.next('.'+opts.classname).eq(0);
				
				if (e && $.isFunction(opts.before)) {
					opts.before.call(this, div);
				}
				
				updateCss(t, div);
				
				div.stop().show(0);
				div.fadeTo(opts.durationIn, opts.opacity);
			};
			
			function _out(e) {
				$(this).stop().fadeTo(opts.durationOut, 0, function () {
					$(this).hide(0);
				});
				
				if (e && $.isFunction(opts.after)) {
					opts.after.call(this);
				}
			};
			
			function updateCss(t, div) {
				// abs positioning
				div.css({top:t.position().top, left:t.position().left});
				// set size the same as the target
				div.width(opts.useOuter ? t.outerWidth() : t.width())
				   .height(opts.useOuter ? t.outerHeight() : t.height());
			}
			
			function hookOne(index, value) {
				var t = $(value),
					div = $('<div class="'+opts.classname+'"></div>');
				
				// set the background-color if required
				if (opts.color) {
					div.css({backgroundColor:opts.color});
				}
				
				// set the parent as relative
				t.parent().css('position','relative');
				
				// hide overlay, and set it on top of the target
				div.css({display:'none',position:'absolute',zIndex:parseInt(t.css('z-index'))+1});
				
				// assure fade out
				_out.call(div, null);
				
				// set css
				updateCss(t, div);
				
				// add div into the dom
				t.after(div);
				
				// hook up mouse events
				div.hover(function(e) {
					if (opts.doubleEvents) _in.call(t, e);	// call _in with t as the context
				},_out);
				t.hover(_in, function (e) {
					if (opts.doubleEvents) _out.call(div, e); // call _out with div as the context
				});
			};
		
			this.each(hookOne);
		
	        return this;
	    }
	});
	
})(jQuery);