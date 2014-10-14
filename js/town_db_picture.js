window.TownPictureHelper = function() {
    var image_preview_base = "\
    <div class='trove-content trove-image'>\n\
    <div class='trove-content-row'>\n\
    <div class='heading-wrapper'>\n\
    <div class='heading'></div>\n\
    </div>\n\
    <div class='date'></div>\n\
    </div>\n\
    <div class='trove-content-row'>\n\
    <div class='body'></div>\n\
    </div>\n\
    </div>"

    flickr_image_preloader = function(data) {
        var c = $(image_preview_base);

        c.find(".heading").text(data["title"] || "");
        c.find(".date").text(data.date)
        c.find(".body").text("Loading Flickr Preview.");

        // Eeeeh.

        return c;
    };
    nla_image_preloader = function(data) {
        data.image = data.images.fulltext + "-v";
        data.to_html_preview = image_to_html_preview
        return image_to_html_preview(data);
    };
    no_image_to_html_preview = function(data) {
        var c = $(image_preview_base);

        c.find(".heading").text(data["title"] || "");
        c.find(".date").text(data.date)
        c.find(".body").text("No preview avaliable");

        return c;
    };
    thumbnail_image_to_html_preview = function(data) {
        var c = $(image_preview_base);

        c.find(".heading").text(data["title"] || "");
        c.find(".date").text(data.date)
        var i = $("<img alt='No preview avaliable'/>");
        i.attr("src", data.images.thumbnail);
        i.addClass("thumbnail");
        c.find(".body").append(i);

        return c;
    };
    image_to_html_preview = function(data) {
        var c = $(image_preview_base);

        c.find(".heading").text(data["title"] || "");
        c.find(".date").text(data.date)
        c.find(".body").text("Image avaliable");

        return c;
    };

    function TownPictureHelper_() {

    }

    TownPictureHelper_.prototype.get_function_for_data = function(data) {
        if(data["identifier"] === undefined) {
            // No images avaliable at all.
            return no_image_to_html_preview;
        }
        data.images = {};
        for(var i = 0; i < data.identifier.length; i++) {
            var id = data.identifier[i];
            if(id.type === "url") {
                data.images[id.linktype] = id.value;
            }
        }

        var url = data.images["fulltext"] || "";

        if(url.match(/nla.gov.au/i)) {
            return nla_image_preloader;
        } else if(url.match(/flickr.com/i)){
            return no_image_to_html_preview;
            // I'm too lazy to implement this method.
            // return flickr_image_preloader;
        } else {
            if(data.images["thumbnail"]) {
                return thumbnail_image_to_html_preview;
            } else {
                return no_image_to_html_preview;
            }
        }
    };

    return new TownPictureHelper_();
}();
