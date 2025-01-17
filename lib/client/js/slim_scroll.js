/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.0
 *
 */
(function (f) {
  jQuery.fn.extend({ slimScroll: function (h) {
    var a = f.extend({ width: 'auto', height: '250px', size: '7px', color: '#000', position: 'right', distance: '1px', start: 'top', opacity: 0.4, alwaysVisible: !1, disableFadeOut: !1, railVisible: !1, railColor: '#333', railOpacity: 0.2, railDraggable: !0, railClass: 'slimScrollRail', barClass: 'slimScrollBar', wrapperClass: 'slimScrollDiv', allowPageScroll: !1, wheelStep: 20, touchScrollStep: 200, borderRadius: '7px', railBorderRadius: '7px' }, h); this.each(function () {
      function r (d) {
        if (s) {
          d = d ||
window.event; var c = 0; d.wheelDelta && (c = -d.wheelDelta / 120); d.detail && (c = d.detail / 3); f(d.target || d.srcTarget || d.srcElement).closest('.' + a.wrapperClass).is(b.parent()) && m(c, !0); d.preventDefault && !k && d.preventDefault(); k || (d.returnValue = !1)
        }
      } function m (d, f, h) {
        k = !1; var e = d; var g = b.outerHeight() - c.outerHeight(); f && (e = parseInt(c.css('top')) + d * parseInt(a.wheelStep) / 100 * c.outerHeight(), e = Math.min(Math.max(e, 0), g), e = d > 0 ? Math.ceil(e) : Math.floor(e), c.css({ top: e + 'px' })); l = parseInt(c.css('top')) / (b.outerHeight() - c.outerHeight())
        e = l * (b[0].scrollHeight - b.outerHeight()); h && (e = d, d = e / b[0].scrollHeight * b.outerHeight(), d = Math.min(Math.max(d, 0), g), c.css({ top: d + 'px' })); b.scrollTop(e); b.trigger('slimscrolling', ~~e); v(); p()
      } function C () { window.addEventListener ? (this.addEventListener('DOMMouseScroll', r, !1), this.addEventListener('mousewheel', r, !1), this.addEventListener('MozMousePixelScroll', r, !1)) : document.attachEvent('onmousewheel', r) } function w () {
        u = Math.max(b.outerHeight() / b[0].scrollHeight * b.outerHeight(), D); c.css({ height: u + 'px' })
        var a = u == b.outerHeight() ? 'none' : 'block'; c.css({ display: a })
      } function v () { w(); clearTimeout(A); l == ~~l ? (k = a.allowPageScroll, B != l && b.trigger('slimscroll', ~~l == 0 ? 'top' : 'bottom')) : k = !1; B = l; u >= b.outerHeight() ? k = !0 : (c.stop(!0, !0).fadeIn('fast'), a.railVisible && g.stop(!0, !0).fadeIn('fast')) } function p () { a.alwaysVisible || (A = setTimeout(function () { a.disableFadeOut && s || (x || y) || (c.fadeOut('slow'), g.fadeOut('slow')) }, 1E3)) } var s; var x; var y; var A; var z; var u; var l; var B; var D = 30; var k = !1; var b = f(this); if (b.parent().hasClass(a.wrapperClass)) {
        var n = b.scrollTop()

        var c = b.parent().find('.' + a.barClass); var g = b.parent().find('.' + a.railClass); w(); if (f.isPlainObject(h)) { if ('height' in h && h.height == 'auto') { b.parent().css('height', 'auto'); b.css('height', 'auto'); var q = b.parent().parent().height(); b.parent().css('height', q); b.css('height', q) } if ('scrollTo' in h)n = parseInt(a.scrollTo); else if ('scrollBy' in h)n += parseInt(a.scrollBy); else if ('destroy' in h) { c.remove(); g.remove(); b.unwrap(); return }m(n, !1, !0) }
      } else {
        a.height = a.height == 'auto' ? b.parent().height() : a.height; n = f('<div></div>').addClass(a.wrapperClass).css({ position: 'relative',
          overflow: 'hidden',
          width: a.width,
          height: a.height }); b.css({ overflow: 'hidden', width: a.width, height: a.height }); var g = f('<div></div>').addClass(a.railClass).css({ width: a.size, height: '100%', position: 'absolute', top: 0, display: a.alwaysVisible && a.railVisible ? 'block' : 'none', 'border-radius': a.railBorderRadius, background: a.railColor, opacity: a.railOpacity, zIndex: 90 }); var c = f('<div></div>').addClass(a.barClass).css({ background: a.color,
          width: a.size,
          position: 'absolute',
          top: 0,
          opacity: a.opacity,
          display: a.alwaysVisible
            ? 'block' : 'none',
          'border-radius': a.borderRadius,
          BorderRadius: a.borderRadius,
          MozBorderRadius: a.borderRadius,
          WebkitBorderRadius: a.borderRadius,
          zIndex: 99 }); var q = a.position == 'right' ? { right: a.distance } : { left: a.distance }; g.css(q); c.css(q); b.wrap(n); b.parent().append(c); b.parent().append(g); a.railDraggable && c.bind('mousedown', function (a) {
          var b = f(document); y = !0; t = parseFloat(c.css('top')); pageY = a.pageY; b.bind('mousemove.slimscroll', function (a) { currTop = t + a.pageY - pageY; c.css('top', currTop); m(0, c.position().top, !1) })
          b.bind('mouseup.slimscroll', function (a) { y = !1; p(); b.unbind('.slimscroll') }); return !1
        }).bind('selectstart.slimscroll', function (a) { a.stopPropagation(); a.preventDefault(); return !1 }); g.hover(function () { v() }, function () { p() }); c.hover(function () { x = !0 }, function () { x = !1 }); b.hover(function () { s = !0; v(); p() }, function () { s = !1; p() }); b.bind('touchstart', function (a, b) { a.originalEvent.touches.length && (z = a.originalEvent.touches[0].pageY) }); b.bind('touchmove', function (b) {
          k || b.originalEvent.preventDefault(); b.originalEvent.touches.length &&
(m((z - b.originalEvent.touches[0].pageY) / a.touchScrollStep, !0), z = b.originalEvent.touches[0].pageY)
        }); w(); a.start === 'bottom' ? (c.css({ top: b.outerHeight() - c.outerHeight() }), m(0, !0)) : a.start !== 'top' && (m(f(a.start).position().top, null, !0), a.alwaysVisible || c.hide()); C()
      }
    }); return this
  } }); jQuery.fn.extend({ slimscroll: jQuery.fn.slimScroll })
})(jQuery)
