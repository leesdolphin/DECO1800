/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

window.TroveYear = function () {
    function TroveYear_() {
        this.year = 1900;
    }

    TroveYear_.prototype.set_year = function (year) {
        if (year === this.year) {
            return;
        }
        this.year = year;

        $("#timeline").empty();
        timeline_db = [];
        var data = TroveDB.database.get_year_data(this.year);
        for (var i = 0; i < data.length; i++) {
            load_data_to_dom(data[i], true);
        }
        this.do_layout(true);
        $(window).scrollTop(0);
        TroveMonth.update_current_month();
        TroveMonth.update_month_status();
        this.update_current_year();

        this.load_more_data(); // Let's load more data because this is probably the first time the year has been shown.
    };

    TroveYear_.prototype.update_current_year = function () {
        var $p = $("#navbar-year-container");
        var $y = $("#navbar-year-" + this.year);
        $(".navbar-year-current").removeClass("navbar-year-current");
        $y.addClass("navbar-year-current");

        var year_xpos = $y.position().left + $p.scrollLeft();
        var p_half_width = $p.width() / 2;
        var y_half_width = $y.width() / 2;
        $p.scrollLeft(year_xpos - p_half_width - y_half_width);
    };

    TroveYear_.prototype.load_more_data = function (year) {
        TroveDB.trove_loaders.get(year || this.year).execute();
    };

    function load_data_to_dom(data, ignore_scroll) {
        var id = "trove-content-id-" + data.id;
        var sort = (data.day <= 9 ? "0" : "") + data.day + "-" + data.id;

        var c = $("#" + id);
        if (c.length === 0) {
            var c = $(data.html_helper.preview(data));
            c.attr("id", id);
            c.attr("sort", sort);
            c.addClass("trove-content");
            
            $(c).click(function(){
                $("#box").empty();
                $("#box").html($(this).html());
                $("#lightboxContent").show();
            });
        }

        var content = get_month_for(data.year, data.month);

        var left = content.find(".left-content");
        var ll = height_of_children(left);
        var right = content.find(".right-content");
        var rl = height_of_children(right);

        if (rl < ll) {
            right.append(c);
        } else {
            left.append(c);
        }

    }

    TroveYear_.prototype.do_layout = function do_layout(ignore_scroll) {
        if (ignore_scroll || $("#timeline").children().length === 0) {
            // Nothing in timeline. Just ignore the scrolling stuff.
            ignore_scroll = true;
        } else if ($(window).scrollTop() < NAVBAR_HEIGHT) {
            // The window is near the top. Let's keep it there.
            ignore_scroll = 1 + $(window).scrollTop(); // Truthy(evaluatues to true when used in an if statement)
        }

        $("#timeline .month-container").each(function(idx, month) {
            layout_month_internal(month);

            $myNav = $("#navbar-month-" + $(month).attr("month"));
            $myNav.removeClass("navbar-month-missing");
        });

        if (!ignore_scroll) {
            // Select all `month-container`s that are on the screen.
            var $w = $(window);
            var $aDateShown = $(".month-container:onScreen").first();
            var deltaOffset = $w.scrollTop() - $aDateShown.offset().top;
        }

        if (!ignore_scroll) {
            var scroll = $w.scrollTop();
            $w.scrollTop(deltaOffset + $aDateShown.offset().top);
            if (scroll !== $w.scrollTop()) {
            }
        } else if (ignore_scroll !== true) {
            // ignore scroll is a number(probably).

            $(window).scrollTop(ignore_scroll - 1); // Decode it.
        }

        // Now update the headings at the top.
    };

    function layout_month_internal(month_content) {
        var content = $(month_content);
        
        var mapping = {};
        var contentIds = content.find(".trove-content").map(function (ixd, item) {
            var s = $(item).attr("sort");
            mapping[s] = $(item);
            $(item).detach();
            return s;
        }).sort();

        var left = content.find(".left-content");
        var ll = height_of_children(left);
        var right = content.find(".right-content");
        var rl = height_of_children(right);

        var i = 0;
        for (; i < contentIds.length; i++) {
            var id = contentIds[i];
            var elm = $(mapping[id]);
            if (rl < ll) {
                right.append(elm);
                rl += elm.height();
            } else {
                left.append(elm);
                ll += elm.height();
            }
        }
    }

    $(document).ready(function () {
        TroveDB.database.add_data_listener(function (data, year, id) {
            if (year !== TroveYear.year) {
                return; // Discard event as its data will not be shown.
            }
            load_data_to_dom(data);
        });
    });


    return new TroveYear_();
}();




$(document).ready(function () {

    window.NAVBAR_HEIGHT = $(".navbar").first().height();

    $("#navbar-year-container").empty();
    for (var i = 1850; i <= 2014; i++) {
        var $y = $("<div class='navbar-year'></div>")
                .attr("id", "navbar-year-" + i)
                .text(i)
                .click(function (i) {
                    // This outer function allows the inner function to recieve the correct value of `i`
                    return function () {
                        window.location.hash = "#" + i;
                    };
                }(i));
        ;
        $("#navbar-year-container").append($y);
    }

    function new_timer_fns(left_side, elm_selector) {
        var t = undefined;
        var mx = 0;
        var click = false;
        function timer() {
            var factor = 1;
            if (click) {
                factor = 20;
            } else {
                var width = $(elm_selector).width();
                var dist = left_side ? width - mx : mx;
                var factor = Math.exp(dist / width) * 5;
            }
            factor *= (left_side ? -1 : 1);
            $("#navbar-year-container").scrollLeft(
                    $("#navbar-year-container").scrollLeft() + factor);
        }
        $(elm_selector).mouseleave(function (e) {
            if (t) {
                clearInterval(t);
            }
            click = false;
            t = undefined;
        }).mousemove(function (e) {
            mx = e.offsetX;
            if (t === undefined) {
                t = setInterval(timer, 1000 / 30);
            }
        }).mousedown(function (e) {
            mx = e.offsetX;
            click = true;
            if (t === undefined) {
                t = setInterval(timer, 1000 / 30);
            }
        }).mouseup(function (e) {
            mx = e.offsetX;
            click = false;
        });
    }
    new_timer_fns(true, "#navbar-year-overlay-left");
    new_timer_fns(false, "#navbar-year-overlay-right");

    function hash_update() {
        var hash = parseInt(window.location.hash.substring(1));

        if (hash && 1850 <= hash && hash <= 2014) {
            TroveYear.set_year(hash);
        } else {
            window.location.hash = "#1950"; // TODO change this - maybe.
            // Invalid hash - should probably do something here
        }
    }
    hash_update();
    $(window).on('hashchange', hash_update);
});
