@database = {}

months = 
  1: ["Jan", "January"]
  2: ["Jan", "Febuary"]
  3: ["Jan", "March"]
  4: ["Jan", "April"]
  5: ["Jan", "May"]
  6: ["Jan", "June"]
  7: ["Jan", "July"]
  8: ["Jan", "August"]
  9: ["Jan", "September"]
  10: ["Jan", "October"]
  11: ["Jan", "November"]
  12: ["Jan", "December"]

make_year = (year, months) ->
  year = parseInt(year)
  timeline = $("#timeline")
  before = elm = after = 0;
  yrid = "y#{year}"
  for e in timeline.children("[id^='y']")
    if not e.id?
      continue
    if e.id == yrid
      elm = $ e
      break
    else 
      yr = parseInt e.id[1..]
      if year < yr
        before = e
        break
      else if year > yr
        after = e
  
  if not elm
    elm = $("<div></div>")
    elm.attr "id", "y#{year}"
    if before
      $(before).before elm
    else
      $(after).after elm
  # TODO add month elements to year element
  elm.empty()
  for m in [1..12]
    e = $("<div></div>")
    elm.append $("<div class='month-heading'>#{months[m][1]} #{year}</div>")
    e.attr "id", "y#{year}m#{m}"
    elm.append(e)
       
      





$ ->
  trove = new Trove()
  $.extend trove.defaults, {
    q: town
    include: "articletext,links,years"
    zone: "picture,newspaper,map,article"
  }
  for yr in [1900..2000]
    make_year(yr)
  
  
  
  
    