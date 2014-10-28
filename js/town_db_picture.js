function build_preview_base(data, image) {
    var c = $(BASE_CONTENT_HTML);
    c.addClass("trove-image");
    c.find(".heading").text(data["title"] || "");
    c.find(".date").text(data.date);
    c.find('.link a').attr('href', data.troveUrl);

    if (image) {
        var i = $("<img alt='No preview avaliable'/>")
                .attr("src", image)
                .addClass("thumbnail");
        c.find(".body").append(i);
    }

    return c;
}



flickr_image = function () {
    var api_key = "c95e2aae5d7e30aed08ebee98ab96c79";
    var request_url = "https://api.flickr.com/services/rest/";
    var base_params = {"method": "flickr.photos.getInfo",
        "api_key": api_key,
        "format": "json",
        "nojsoncallback": "1"};

    /*
     * Loads the flickr image defined in data and sets the source of img_tag. 
     * Also sets `data.images.flickr` to be the full flickr url.
     */
    function load_flickr(data, img_tag) {
        if (data.flickr) {
            // Currently loading stuff for this piece of data.
            // So we will add the image tag to the queue.
            data.flickr.img_tags.push(img_tag);
            return;
        } else {
            data.flickr = {img_tags: [img_tag]};
        }
        var url_comps = data.images.fulltext.split("/");
        var photo_id = url_comps[url_comps.length - 2];
        var params = $.extend({"photo_id": photo_id}, base_params);
        $.ajax({
            type: "GET",
            url: request_url,
            data: params,
            complete: function (jqxhr) {
                resp = jqxhr.responseJSON;
                if (resp.stat === "ok" && resp.photo.usage.candownload === 1) {
                    var flickr_image_url = "http://farm" + resp.photo.farm
                            + ".staticflickr.com/" + resp.photo.server
                            + "/" + resp.photo.id + "_" + resp.photo.secret + "_z.jpg";
                    data.images.flickr = flickr_image_url;
                    for (var tag in data.flickr.img_tags) {
                        // Now update the image tags with the new image url
                        $(data.flickr.img_tags[tag]).attr("src", flickr_image_url);
                    }
                }
            }
        });
    }

    function flickr_image_preview(data) {
        var c = build_preview_base(data);

        var thumbnail = $("<img />")
                .addClass("thumbnail");
        if (data.images.flickr) {
            // Flickr image loaded already.
            thumbnail.attr("src", data.images.flickr);
        } else {
            // The thumbnail is a valid image; so we'll use it until we need to.
            thumbnail.attr("src", data.images.thumbnail);

            load_flickr(data, thumbnail);
        }

        c.find(".body").append(thumbnail);

        return c;
    }

    function flickr_image_full(data) {
    }
    return {preview: flickr_image_preview, full: flickr_image_full};
}();


nla_image = function () {
    function nla_image_preview(data) {
        // Bassed off code from
        // http://deco1800.uqcloud.net/troveImage.php
        // Take the `fulltext` image and add `-v` to get the actual image.
        return build_preview_base(data, data.images.fulltext + "-v");
    }

    function nla_image_full(data) {

    }

    return {preview: nla_image_preview, full: nla_image_full};
}();



var missing_image = function () {
    function missing_image_preview(data) {
        var c = build_preview_base(data);
        c.find(".body").text("No preview avaliable");

        return c;
    }

    return {preview: missing_image_preview};
}();
thumbnail_image = function () {
    function thumbnail_image_preview(data) {
        return build_preview_base(data, data.images.thumbnail);
    }

    return {preview: thumbnail_image_preview};
}();
full_text_image = function () {
    function full_text_image_preview(data) {
        return build_preview_base(data, data.images.fulltext);
    }

    return {preview: full_text_image_preview};
}();

function TownPictureHelper_() {

}


window.TownPictureHelper = function () {

    /*
     * This function returns a dictionary with the keys `preview` and `full` and whose values are functions:
     *
     * preview: Should return a jQuery html object that can be displayed as a preview
     *
     * full:    Should return a jQuery html object that can be displayed as the full view(in a popup).
     *
     */
    TownPictureHelper_.prototype.get_function_for_data = function (data) {
        if (data["identifier"] === undefined) {
            // No images avaliable at all.
            return missing_image;
        }
        data.images = {};
        for (var i = 0; i < data.identifier.length; i++) {
            var id = data.identifier[i];
            if (id.type === "url") {
                data.images[id.linktype] = id.value;
            }
        }

        var url = data.images["fulltext"] || "";

        if (url.match(/nla.gov.au/i)) {
            return nla_image;
        } else if (url.match(/flickr.com/i)) {
            return flickr_image;
        } else {
            if (data.images.thumbnail) {
                return thumbnail_image;
            } else if(data.images.fulltext) {
                return full_text_image;
            }else {
                return missing_image;
            }
        }
    };

    return new TownPictureHelper_();
}();
