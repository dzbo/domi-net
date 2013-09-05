function load_map(adress, x, y) { 	
    if (GBrowserIsCompatible()) {
    	function createTabbedMarker(point,html1,html2,label1,label2) {
    		var marker = new GMarker(point);
     		GEvent.addListener(marker, "click", function() {
    			marker.openInfoWindowTabsHtml([new GInfoWindowTab(label1,html1)]);
        	});
        	return marker;
    	}
    	var map = new GMap2(document.getElementById("map"));
    	map.addControl(new GLargeMapControl());
    	map.addControl(new GMapTypeControl());
    	map.setCenter(new GLatLng(x, y),15);
     	var point = new GLatLng(x, y);
      	var marker = createTabbedMarker(point, adress);
      	map.addOverlay(marker);
			//map.addControl(new GOverviewMapControl(new GSize(100,70)));
		
		function positionOverview(x,y) {
        	var omap=document.getElementById("map_overview");
        	omap.style.left = x-"px";
        	omap.style.top = y-"px";
        
	        omap.firstChild.style.border = "1px solid gray";
    	}
    }
    else {
      alert("Sorry, the Google Maps API is not compatible with this browser");
    }
}

