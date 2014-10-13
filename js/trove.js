Trove = function () {
    function Trove_() {
        this.defaults = {};
        this.cache = {};
        this.page_size = 20;
    }

    Trove_.prototype.listing = function (page, callback) {
        if (!$.isNumeric(page)) {
            // The page is not a number, so treat it as the callback function.
            callback = page;
            page = 0;
        }
        var q = {
            s: page * this.page_size,
            n: this.page_size
        };
        q = $.extend(q, this.defaults);
        return this.api_call(q, callback);
    };

    Trove_.prototype.api_call = function (data, callbacks) {
        return $.ajax({
            url: "api.php",
            data: data,
            complete: callbacks
        });
    };

    Trove_.prototype.date_listing = function (start_year, end_year, page, callback) {
        if (!$.isNumeric(page)) {
            callback = page;
            page = 0;
        }
        var q = {
            s: page * this.page_size,
            n: this.page_size
        };
        q = $.extend(q, this.defaults);
        if (!start_year) {
            start_year = "1000";
            q["sortby"] = "datedesc";
        }
        if (!end_year) {
            end_year = "3000";
            q["sortby"] = "dateasc";
        }
        if (start_year && end_year) {
            q["sortby"] = "relevance";
        }



        q["q"] = q["q"] + " date:[" + start_year + " TO " + end_year + "]";
        return this.api_call(q, callback);
    };

    var Queue = function () {
        function Queue_(trove, start_year, end_year, start_page, success_callback, failure_callback) {
            this.trove = trove;
            this.start_year = start_year;
            this.end_year = end_year;
            this.start_page = start_page;
            this.success_callback = success_callback;
            this.failure_callback = failure_callback;
            this.is_executing = false;
            this.page_no = start_page;
            this.last_timeout = 0;
            this.timer = null;
        }
        Queue_.prototype.execute = function () {
            var q = this;
            if (this.is_executing) {
                return;
            }
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.is_executing = true;
            this.trove.date_listing(this.start_year, this.end_year, this.page_no, function (jqxhr, status) {
                if (status !== "success") {
                    q.last_timeout = q.last_timeout * 1.2 + 100;
                    q.timer = setTimeout(function () {
                        // Need a wrapper so that `this` is correct inside the next execute call.
                        q.execute();
                    });
                    q.failure_callback(q);
                } else {
                    q.last_timeout = 0;
                    q.page_no++;
                    q.is_executing = false;
                    q.success_callback(q, jqxhr.responseJSON);
                }
            });
        };
        return Queue_;
    }();

    Trove_.prototype.loading_queue = function (start_year, end_year, start_page, success_callback, failure_callback) {
        return new Queue(this, start_year, end_year, start_page, success_callback, failure_callback);
    };

    return new Trove_();
}();
