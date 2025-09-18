// Safe date-time render if element exists
(function renderDateTime() 
 {
	var el = document.getElementById("datetime");
	if (!el) return;
	var dt = new Date();
	el.innerHTML = dt.toLocaleString();
} )();
