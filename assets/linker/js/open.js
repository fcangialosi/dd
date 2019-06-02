var main = $('#main-dot');
var pratt = $('#pratt-dot');
var broadway = $('#broadway-dot');

var set_closed = function(elem) {
    elem.attr("class", "red-dot");
}

today = new Date();
day = today.getDay();
hour = today.getHours();
minute = today.getMinutes();

if (day == 0) { // Sunday
    set_closed(main);
    set_closed(pratt);
    set_closed(broadway);
} else if (day == 6) { // Saturday
    if (hour < 8 || hour > 14) {
        set_closed(main);
    } else if (hour == 13 && minute >= 30) {
				set_closed(main);
		}
    set_closed(pratt);
    set_closed(broadway);
} else {
    if (hour < 6) {
      set_closed(main);
    } else if (hour == 6 && minute < 30) {
      set_closed(main);
    }
    if (hour < 7) {
      set_closed(pratt);
      set_closed(broadway);
    }
    if (hour > 15) {
      set_closed(pratt);
      set_closed(broadway);
    }
    if (hour >= 20) {
        set_closed(main);
    }
}
