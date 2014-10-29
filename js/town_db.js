window.MAX_DISPALYED = 500;

window.TroveDB = function () {
    var Database = function () {
        function Database() {
            this._data_by_id = {};
            this._id_by_year = [];
            this._data_add_listeners = [];
        }

        Database.prototype.get_data = function (id) {
            return this._data_by_id[id];
        };

        Database.prototype.get_datas = function (ids, include_undefined) {
            var results = [];
            for (var i = 0; i < ids.length; i++) {
                var data = this.get_data(ids[i]);
                if (include_undefined || data !== undefined) {
                    results.push(data);
                }
            }
            return results;
        };

        Database.prototype.get_year_length = function(year) {
            return this.get_year_data_ids(year).length;
        }

        Database.prototype.get_year_data_ids = function (year) {
            // Get it from the db or return an empty array.
            return this._id_by_year[parseInt(year)] || [];
        };

        Database.prototype.get_year_data = function (year) {
            return this.get_datas(this.get_year_data_ids(year));
        };

        Database.prototype.add_data = function (data_object) {
            var year = parseInt(data_object.year);
            var id = data_object.id;
            if (year) {
                this._data_by_id[id] = data_object;
                if (this._id_by_year[year] === undefined) {
                    this._id_by_year[year] = [];
                }
                this._id_by_year[year].push(id);

                for (var i = 0; i < this._data_add_listeners.length; i++) {
                    this._data_add_listeners[i](data_object, year, id);
                }
                return true;
            } else {
                return false;
            }
        };

        Database.prototype.add_data_listener = function (callback_function) {
            this._data_add_listeners.push(callback_function);
        };

        return Database;
    }();

    var TroveLoaders = function () {
        function TroveLoaders() {
            this.loaders = [];
        }

        TroveLoaders.prototype.get = function (year) {
            var year = parseInt(year);
            if (this.loaders[year] === undefined) {
                return this.loaders[year] = create_queue(year, year, 0);
            } else {
                return this.loaders[year];
            }
        };

        return TroveLoaders;
    }();

    function TroveDB_() {
        this.database = new Database();
        this.trove_loaders = new TroveLoaders();
    }

    return new TroveDB_();
}();


window.create_queue = function () {
    function article_to_html_callback(data) {
        var c = $(BASE_CONTENT_HTML);
        c.addClass("trove-newpaper");

        var text = "No article text avaliable";
        if (data.articleText) {
            text = data.articleText;
        } else if (data.snippit) {
            text = data.snippit;
        }
        text = text.replace(window.troveHtmlTagRegexp, "");

        c.attr("id", data.id);

        c.find('.body').text(text);
        c.find('.heading').text(data.heading);
        c.find('.date').text(data.date);
        c.find('.link a').attr('href', data.troveUrl);
        return c;
    }

    function success_callback(queue, data) {
        var total = 0;
        var num_ret = 0;
        var zones = data.response.zone;
        for (var zoneNo = 0; zoneNo < zones.length; zoneNo++) {
            var zoneData = zones[zoneNo].records;
            var zoneType = zones[zoneNo].name;
            total += parseInt(zoneData.total);
            num_ret += parseInt(zoneData.n);
            if (zoneData.n === "0") {
                // No data - no point.
                continue;
            }
            if (zoneType === "newspaper") {
                for (var i = 0; i < zoneData.article.length; i++) {
                    var content = $.extend({}, zoneData.article[i]);
                    var date = parse_date(content.date);
                    content.year = date.y;
                    content.month = date.m;
                    content.day = date.d;
                    content.html_helper = {preview: article_to_html_callback,
                        full: $.noop()};
                    TroveDB.database.add_data(content);
                }
            } else if (zoneType === "picture") {
                for (var i = 0; i < zoneData.work.length; i++) {
                    var content = $.extend({}, zoneData.work[i]);
                    if (!content.date) {
                        content.date = content.issued;
                    }
                    if (content.date) {
                        var date = parse_date(content.date);
                    }
                    if (date === undefined) {
                        continue;
                    }
                    if (date.d === 0) {
                        content.date_generated = true;
                        content.original_date = $.extend({}, date);
                        var id = parseInt(content.id);
                        if (date.m === 0) {
                            date.m = (id % 12) + 1;
                            date.d = (((id - (id % 12)) / 12) % 31) + 1;
                        } else {
                            date.d = (id % 31) + 1;
                        }
                    }

                    content.year = date.y;
                    content.month = date.m;
                    content.day = date.d;
                    content.html_helper = TownPictureHelper.get_function_for_data(content);
                    TroveDB.database.add_data(content);
                }
            } // TODO add more data types.
        }

        var total = queue.total = Math.min(total, MAX_DISPALYED);

        if (num_ret === 0 || TroveDB.database.get_year_length(queue.start_year) >= MAX_DISPALYED) {
            queue.complete = true;
        } else {
            // Keep loading if there is more(and it doesn't go over our limit.
            TroveDB.trove_loaders.get(TroveYear.year).execute();
        }

        TroveYear.do_layout();
    }

    function create_queue_(start, end, page_no) {
        if (!page_no) {
            page_no = 0;
        }
        var t = Trove.loading_queue(start, end, page_no, success_callback);
        return t;
    }
    return create_queue_;
}();
