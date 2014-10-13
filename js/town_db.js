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

                for(var i = 0; i < this._data_add_listeners.length; i++) {
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
    var article_to_html_callback = function (data) {
        var c = $("\
                    <div class='trove-content trove-newpapaer'>\n\
                      <div class='trove-content-row'>\n\
                        <div class='heading-wrapper'>\n\
                          <div class='heading'></div>\n\
                        </div>\n\
                        <div class='date'></div>\n\
                      </div>\n\
                      <div class='trove-content-row'>\n\
                        <div class='body'></div>\n\
                      </div>\n\
                    </div>");

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
        return c;
    };

    var success_callback = function (queue, data) {
        // TODO make this work for more data types.
        var dat = data.response.zone[0].records.article;
        for (var i = 0; i < dat.length; i++) {
            var content = $.extend({}, dat[i]);
            var date = parse_date(content.date);
            content.year = date.y;
            content.month = date.m;
            content.day = date.d;
            content.to_html_preview = article_to_html_callback;
            TroveDB.database.add_data(content);
        }
    };


    function create_queue_(start, end, page_no) {
        if (!page_no) {
            page_no = 0;
        }
        t = Trove.loading_queue(start, end, page_no, success_callback, function () {});
        return t;
    }
    return create_queue_;
}();