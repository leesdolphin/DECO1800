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

        // TODO update dom with new data.
        TroveMonth.update_current_month();
        TroveMonth.update_month_status();
    };

    TroveYear_.prototype.load_more_data = function (year) {
        TroveDB.trove_loaders.get(year || this.year).execute();
    };


    function load_data_to_dom(data, ignore_scroll) {
        if ($("#timeline").children().length === 0) {
            // Nothing in timeline. Just ignore the scrolling stuff.
            ignore_scroll = true;
        } else if ($(window).scrollTop() < NAVBAR_HEIGHT) {
            // The window is near the top. Let's keep it there.
            ignore_scroll = 1 + $(window).scrollTop(); // Truthy
        }

        if (!ignore_scroll) {
            // Select all `date-container`s that are on the screen.
            var $w = $(window);
            var $aDateShown = $(".date-container:onScreen");
            var deltaOffset = $w.scrollTop() - $aDateShown.offset().top;
            console.log("Old Scroll: ", $w.scrollTop());
        }

        var id = "trove-content-id-" + data.id;

        var c = $("#" + id);
        if (c.length === 0) {
            var c = $(data.to_html_preview(data));
            c.attr("id", id);
        }

        var content = get_date_for(data.year, data.month, data.day);

        // TODO make this whole thing look better when there is only 1 item in the date.

        var left = content.find(".left-content");
        var right = content.find(".right-content");

        var ll = height_of_children(left);
        var rl = height_of_children(right);

        if (rl < ll) {
            right.append(c);
        } else {
            left.append(c);
        }
        if (!ignore_scroll) {
            var scroll = $w.scrollTop();
            $w.scrollTop(deltaOffset + $aDateShown.offset().top);
            if (scroll !== $w.scrollTop()) {
                console.log("New Scroll: ", $w.scrollTop());
            }
        } else if (ignore_scroll !== true) {
            // ignore scroll is a number(probably).
            $(window).scrollTop(ignore_scroll - 1); // Decode it.
        }

        // Now update the headings at the top.

        $myNav = $("#navbar-month-" + data.month);
        $myNav.removeClass("navbar-month-missing");
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
    
    $(window).on('hashchange', function () {

    });






});
