/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

window.TroveMonth = function () {
    function TroveMonth() {
    }

    function update_current_month() {
        var $m = $(".month-container:onScreen").first();
        var month = $m.attr("month");
        $(".navbar-month-current").removeClass("navbar-month-current");
        $("#navbar-month-" + month).addClass("navbar-month-current");
    }
    TroveMonth.prototype.update_current_month = update_current_month;

    function update_month_status() {
        var data = TroveDB.database.get_year_data(TroveYear.year);
        $(".navbar-month").addClass("navbar-month-missing");
        for(var i = 0; i < data.length; i++) {
            $("#navbar-month-" + data[i].month).removeClass("navbar-month-missing");
        }
    }
    TroveMonth.prototype.update_month_status = update_month_status;

    function navbar_month_click_handler(event) {
        // This will error if called before this is setup.
        var y = "#y" + TroveYear.year;
        var month = event.data;
        var $m = $(y + "m" + month);
        var $w = $(window);
        if ($m.length !== 0) {
            $w.scrollTop($m.offset().top - NAVBAR_HEIGHT);
        } else {
            // Search down then search up.
            for (var m = month + 1; m <= 12; m++) {
                $m = $(y + "m" + m);
                if ($m.length !== 0) {
                    $w.scrollTop($m.offset().top - NAVBAR_HEIGHT);
                    return;
                }
            }
            for (var m = month - 1; m >= 1; m--) {
                $m = $(y + "m" + m);
                if ($m.length !== 0) {
                    $w.scrollTop($m.offset().top - NAVBAR_HEIGHT);
                    return;
                }
            }
            // Oh, we don't have any months - sigh.
            // We'll just scroll to the top of the page.
            $w.scrollTop(0);
        }
    }
    
    function init_navbar_months() {
        $("#navbar-month-container").empty();
        for (var month = 1; month <= 12; month++) {
            var c = $("<a></a>").addClass("navbar-month");
            c.text(MONTH_NAMES[month].substring(0, 3));
            c.attr("id", "navbar-month-" + month);
            c.click(month, navbar_month_click_handler);

            $("#navbar-month-container").append(c);
        }
        update_current_month();
        update_month_status();
    }
    $(document).ready(function () {
        $(window).scroll(update_current_month);
        // Update current month on scroll.
        init_navbar_months();
    });

    return new TroveMonth();
}();