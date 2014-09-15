class @Trove
  
  defaults: {}
  cache: {}
  page_size: 20
  
  listing: (page, callback) ->
    if not $.isNumeric page
      [callback, page] = [page, 0]
    q = {
      s: page * @page_size
      n: @page_size
    }
    q = $.extend q, @defaults
    @api_call q, callback
    
  api_call: (data, callbacks...) ->
    $.ajax 
      url: "api.php"
      data: data
      complete: callbacks
      
  date_listing: (start_year, end_year, page, callback) ->
    if not $.isNumeric page
      [callback, page] = [page, 0]
    q = {
      s: page * @page_size
      n: @page_size
    }
    q = $.extend q, @defaults
    
    if not start_year
      start_year = "1"; ## This is quite early
      q["sortby"] = "datedesc";
    if not end_year
      end_year = "3000"; ## This is quite late
      q["sortby"] = "dateasc";
      
    q["q"] = "(#{q['q']})  date:[#{start_year} TO #{end_year}]"
    @api_call q, callback
    
  
  
  
    
    
  