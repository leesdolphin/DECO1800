
window.troveHtmlTagRegexp = /<\/?(p|span)>/ig;

/**
 * Add an element into an array so that it is in the correct position. Also
 *  adds the element to the page.
 *
 * If there are no elements after the `id` then it is added at `id` and
 *  appended to the end of `parent` using `parent.append(maker_function().element)`
 *
 * Otherwise it looks for the smallest element after `id` which has a value
 *  and adds the new element before it(so that it appears in order).
 *
 * If there is already an element at `id` in the array then `maker_function` is
 *  not called.
 * If the array is not valid(the last element(array.length-1) is undefined) then
 *  this function may break.
 *
 */
function add_ordered_element(id, stored_array, parent, maker_function) {
    if (stored_array.length <= id) {
        // We don't have any numbers after this one.
        var m_elm = maker_function();
        parent.append(m_elm.element);
        stored_array[id] = m_elm;
    } else if (stored_array[id] === undefined) {
        for (var i = id + 1; i < stored_array.length; i++) {
            if (stored_array[i] !== undefined) {
                // Found a year that is after the current one.
                var m_elm = maker_function();
                stored_array[i].element.before(m_elm.element);
                stored_array[id] = m_elm;
                return;
            }
        }
    }
}

/**
 * Returns the content div for a given year/month/day, creating it as necesary.
 */
function get_month_for(year, month) {
    var ymid = "#y" + year + "m" + month;
    if ($("#timeline").find(ymid).length === 0) {
        make_month(year, month);
    }
    return $("#timeline").find(ymid).find(".content");
}


function parse_date(date_string) {
    // DAte: yyyy-mm-dd
    if (date_string === undefined) {
        return undefined;
    } else if ($.isNumeric(date_string)) {
        return {y: date_string, m: 0, d: 0};
    }
    date_split = date_string.split("-");
    if (date_split.length === 1) {
        return {y: parseInt(date_split[0]), m: 0, d: 0};
    } else if (date_split.length === 2) {
        var m = parseInt(date_split[1]);
        if (m > 12 || m < 1) {
            return {y: parseInt(date_split[0]), m: 0, d: 0};
        }
        return {y: parseInt(date_split[0]), m: m, d: 0};
    } else {
        var m = parseInt(date_split[1]);
        if (m > 12 || m < 1) {
            return {y: parseInt(date_split[0]), m: 0, d: 0};
        }
        var d = parseInt(date_split[2]);
        if (d > 31 || d < 1) {
            return {y: parseInt(date_split[0]), m: m, d: 0};
        }
        return {y: parseInt(date_split[0]), m: m, d: d};
    }
}

function get_year(year) {
    var year = parseInt(year);
    if ($("#y" + year).length === 0) {
        make_year(year);
    }
    return $("#y" + year);
}
function make_year(year) {
    var year = parseInt(year);
    add_ordered_element(year, timeline_db, $("#timeline"), function () {
        var e = $("<div></div>");
        e.attr("id", "y" + year);
        e.attr("year", year);
        return {
            element: e,
            months: []
        };
    });
}

function make_month(year, month) {
    var month = parseInt(month);
    get_year(year);
    var yr_data = timeline_db[year];
    var elm = yr_data.element;
    var id = "y" + year + "m" + month;
    add_ordered_element(month, yr_data.months, elm, function () {
        // Make the month elements
        var e = $("<div></div>");
        e.attr("id", id);
        e.addClass("month-container");
        e.attr("month", month);
        e.attr("year", year);
        var content = $("<div class='content'></div>");

        e.append($("<div class='month-heading'>" + MONTH_NAMES[month] + " " + year + "</div>"));
        e.append(content);
        return {
            element: e
        };
    });
    var $c = $("#" + id + " .content");
    $c.masonry({
        "isFitWidth": true,
        "gutter": 5,
        "itemSelector": '.trove-content',
        "columnWidth": ".trove-content"
    }).masonry("bindResize");
    $c.imagesLoaded()
            .progress(function () {
                TroveYear.do_layout();
            });


}
