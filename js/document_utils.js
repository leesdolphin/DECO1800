
function height_of_children(node) {
    var h = 0;
    var c = node.children();
    for (var i = 0; i < c.length; i++) {
        h += $(c[i]).height();
    }
    return h;
}







/** The following is copied from http://benpickles.github.io/onScreen/jquery.onscreen.js */
// onScreen jQuery plugin v0.2.1
// (c) 2011-2013 Ben Pickles
//
// http://benpickles.github.io/onScreen
//
// Released under MIT license.
(function ($) {
    /**
     * This adds a selector for onScreen. So $("div:onScreen") will return all elements currently on screen(either partially or fully).
     */
    $.expr[":"].onScreen = function (elem) {
        var $window = $(window);
        var viewport_top = $window.scrollTop() + NAVBAR_HEIGHT;
        var viewport_height = $window.height() - NAVBAR_HEIGHT;
        var viewport_bottom = viewport_top + viewport_height;
        var $elem = $(elem);
        var top = $elem.offset().top;
        var height = $elem.height();
        var bottom = top + height;

        return (top >= viewport_top && top < viewport_bottom) ||
                (bottom > viewport_top && bottom <= viewport_bottom) ||
                (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom);
    };
})(jQuery);
/** The above is copied from http://benpickles.github.io/onScreen/jquery.onscreen.js */
