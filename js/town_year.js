window.BASE_CONTENT_HTML = "\
    <div>\n\
        <div class='trove-content-row close-row'>\n\
            <div class='closebox'>\n\
                <a>x</a>\n\
            </div>\n\
        </div>\n\
        <div class='trove-content-row'>\n\
            <div class='trove-content-header'>\n\
                <div class='heading-wrapper'>\n\
                    <div class='heading'></div>\n\
                </div>\n\
                <div class='date-link-wrapper'>\n\
                    <div class='date-link-wrapper-table'>\n\
                        <div class='date'></div>\n\
                        <div class='link'>\n\
                            <a class='preview-hidden' target='_blank'>Open in new tab</a>\n\
                        </div>\n\
                        <div class='pdf-hidden'>\n\
                            <a>View on Trove</a>\n\
                        </div>\n\
                    </div>\n\
                </div>\n\
            </div>\n\
        </div>\n\
        <div class='trove-content-row trove-content-body'>\n\
            <div class='body'></div>\n\
        </div>\n\
        <div class='disp-frame'><iframe src='about:blank'></iframe></div>\n\
    </div>";


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
        $("#navbar-loading-contaner-fill").width("0%");
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

    function load_data_to_dom(data) {
        var id = "trove-content-id-" + data.id;
        var sort = (data.day <= 9 ? "0" : "") + data.day + "-" + data.id;

        var c = $("#" + id);
        if (c.length === 0) {
            var c = $(data.html_helper.preview(data));
            c.attr("id", id);
            c.attr("sort", sort);
            c.addClass("trove-content");

            $(c).click(function () {
                $("#box").empty();
                $("#box").html($(this).html());
                $(".pdf-hidden a").click(function(){
                    $("#box .trove-content-body .body").toggle();
                    $("#box .disp-frame").toggle();
                    // We don't want a whole heap of frames with loaded content on the page
                    if ($("#box iframe").is(":visible")){
                        $("#box iframe").attr("src", data.troveUrl);
                        $('.pdf-hidden a').html('View page text');
                    } else {                
                        $("#box iframe").attr("src", 'about:blank');
                        $('.pdf-hidden a').html('View on Trove');
                    }
                });
                $(".closebox a").click(function(){lightboxclose();});
                /*We need to override the old text in the case that the user
                was viewing the last article on the iframe*/ 
                $('.pdf-hidden a').html('View on Trove');
                $("#lightboxContent").fadeIn();
            });
        }

        var content = get_month_for(data.year, data.month);

        if (content.children().length === 0) {
            content.append(c);
        } else {
            var added = false;
            var children = content.children();
            for (var i = 0; i < children.length; i++) {
                var child = $(children[i]);
                var csort = child.attr("sort");
                if (csort > sort) {
                    child.before(c);
                    added = true;
                    break;
                }
            }
            if (!added) {
                content.append(c);
            }
        }
    }

    TroveYear_.prototype.do_layout = function do_layout(ignore_scroll) {
        var queue = TroveDB.trove_loaders.get(this.year);
        var current_year = parseInt($("#navbar-loading-contaner-fill").attr("year")) === this.year;
        var $fill = $("#navbar-loading-contaner-fill");
        var displayed = TroveDB.database.get_year_length(this.year);

        if (!current_year) {
            // Changed year - reset the bar before continuing.
            $fill.css({"width": "0%", "background-color": "black"});
            $fill.attr({"year": this.year, "complete": "false"});
        }
        if (queue.complete) {
            if ($fill.attr("complete") === "true") {
                $fill.css({"width": "0%"});
            } else {
                $fill.attr("complete", "true")
                        .animate({"width": "100%"}, 500).animate({"backgroundColor": "#00dd00"}, 600)
                        .animate({"backgroundColor": "black"}, 200);
            }
        } else {
            var percentage = (queue.total ? displayed / queue.total : 0) * 100;
            $fill.animate({"width": percentage + "%"}, 500);
        }

        if (displayed === 0 && queue.complete) {
            $("#timeline").empty().append("<div class='no-content'><strong>Sorry</strong> there is no data avaliable.</div>");
            return;
        } else {
            $(".no-content").remove();
        }

        if (ignore_scroll || $("#timeline").children().length === 0) {
            // Nothing in timeline. Just ignore the scrolling stuff.
            ignore_scroll = true;
        } else if ($(window).scrollTop() < NAVBAR_HEIGHT) {
            // The window is near the top. Let's keep it there.
            ignore_scroll = 1 + $(window).scrollTop(); // Truthy(evaluatues to true when used in an if statement)
        }

        if (!ignore_scroll) {
            // Select all `month-container`s that are on the screen.
            var $w = $(window);
            var $aDateShown = $(".month-container:onScreen").first();
            var deltaOffset = $w.scrollTop() - $aDateShown.offset().top;
        }

        $("#timeline .month-container").each(function (idx, month) {
            layout_month_internal(month);

            $myNav = $("#navbar-month-" + $(month).attr("month"));
            $myNav.removeClass("navbar-month-missing");
        });

        if (!ignore_scroll) {
            var scroll = $w.scrollTop();
            $w.scrollTop(deltaOffset + $aDateShown.offset().top);
            if (scroll !== $w.scrollTop()) {
            }
        } else if (ignore_scroll !== true) {
            // ignore scroll is a number(probably).

            $(window).scrollTop(ignore_scroll - 1); // Decode it.
        }
    };

    function layout_month_internal(month_content) {
        var content = $(month_content).find(".content");
        var masonry = content.data('masonry');
        masonry.reloadItems();
        masonry.layout();
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

    var l = imagesLoaded($(".container"), function () {
    });
    l.on('progress', function () {
        console.log(arguments);
    });

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
