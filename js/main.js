

var overlay = new ol.Overlay(({
  element: document.getElementById('popup'),
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
}));

 
var osm = new ol.layer.Tile({
	source: new ol.source.OSM({
		layer: 'osm',
	visible: true,
	name: 'osm'
	})
});

	
var bing = new ol.layer.Tile({
	source: new ol.source.BingMaps({
		key:'AqbyLoz35jf2t-O8ZHd-NWXjp131X1THM92O8ha6yp2B56GtpI9Xhh6tjPTBgJeh',
		imagerySet: 'Aerialwithlabels'
	}),
	visible: false,
	name: 'bing'
});

download_vector_osgl = function(layer_name){
    var url = "http://localhost:8080/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeName="+
        layer_name+"&outputFormat=shape-zip";
    window.open(url);
}

download_vector_local = function(layer_name){
    var url = "http://localhost:8080/geoserver/wfs?service=wfs&version=2.0.0&request=GetFeature&typeName="+
        layer_name+"&outputFormat=shape-zip";
    window.open(url);
}



download_raster_osgl = function(layer_name, layer){
    var url = "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=vezba1:Srbija1750GK&compression=LZW&tiling=true&tileheight=256&tilewidth=256";
    window.open(url);
}

var map = new ol.Map({
	layers: [osm,bing],
	overlays: [overlay],
	target: 'map',
	controls: ol.control.defaults().extend([
			new ol.control.ScaleLine(),
			new ol.control.ZoomSlider()
	]),
  view: new ol.View({
    center: [2595665.986509167, 5361249.9352637725],
	zoom: 6,
  })
});

var vms1 = new ol.layer.Tile({
    source: new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: {'LAYERS': 'vezba1:Srpske-reke', 'TILED': true,},
    serverType: 'geoserver'
	   })
});
			
var vms2 = new ol.layer.Tile({
    source: new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: {'LAYERS': 'vezba1:Putevi', 'TILED': true,},
    serverType: 'geoserver'			
    })
});


var vms3 = new ol.layer.Tile({
    source: new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: {'LAYERS': 'vezba1:Srbija1750GK', 'TILED': true,},
    serverType: 'geoserver'
    })
});

var vms4 = new ol.layer.Tile({
    source: new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/wms',
    params: {'LAYERS': 'vezba1:Vino', 'TILED': true,},
    serverType: 'geoserver'
    })
});

var vectorEl=new ol.layer.Vector({
          source: new ol.source.Vector({
            url: 'http://localhost/geoserver/ows?service=WFS&request=GetFeature&typeName=vezba1:Top12LokSrbija&outputFormat=application/json',
            format: new ol.format.GeoJSON(), 
          })
        });


var merc = "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
var utm = "+proj=utm +zone=34 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
var lamb = "+proj=lcc +lat_1=35 +lat_2=65 +lat_0=52 +lon_0=10 +x_0=4000000 +y_0=2800000 +ellps=GRS80 +units=m"
var dkg = "+proj=tmerc +lat_0=0 +lon_0=21 +k=0.9999 +x_0=7500000 +y_0=0 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs"


map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;

  projekcija = $('input[name=projekcija]:checked').val()
  if(projekcija == 'utm'){
    var hdms = proj4(merc, utm, coordinate);
	var LD1 =proj4(merc, "WGS84", coordinate);
	var lon = LD1[0];
	var lat = LD1[1];
	
	var lin_duz = 0.9996;
        var e_l = 0.0818191910428158;
        var sred_m = 21;
        var fi_r = parseInt(lon)*(Math.PI/180);
        var t_l = Math.tan(fi_r);
        var n_l = e_l*Math.cos(fi_r);
        var C1 = (1+Math.pow(n_l, 2))*Math.pow(Math.cos(fi_r),2)/2;
        var C2 = (5-4*Math.pow(t_l, 2))*Math.pow(Math.cos(fi_r),4)/24;
        var l = (parseInt(lat)-sred_m)*(Math.PI/180);
        var c_l = lin_duz*(1+(C1*Math.pow(l,2))+(C2*Math.pow(l,4)));
        var LD = (c_l-1)*1000;
		document.getElementById('popup-content').innerHTML = '<p id = "klik" >Pozicija klika:</p><code>' + "Koordinate su: " + hdms + " Linearna deformacija: " + LD +
      '</code>';
  overlay.setPosition(coordinate);
	
		
    }

   else if(projekcija == 'lamb'){
        var hdms = proj4(merc, lamb, coordinate);
		var LD1 =proj4(merc, "WGS84", coordinate);
	    var lon = LD1[0];
	    var lat = LD1[1];
      
var a_l = 6377397.155;
		
var e_l = 0.081696831;
    
        
var fi_r = parseInt(lon)*(Math.PI/180);  
        
var N1 = a_l/(Math.sqrt(1-((Math.pow(e_l,2)* Math.pow(Math.sin(fi_r),2)))));
		
var r_l = N1*Math.cos(fi_r);
		var ro_1 = -17714.2743841427;
		
var ro_2 = -9154.31106410611;
		var k_l = -295.266220156939;
		
		
var m_l = (k_l*ro_1)/r_l;
		var n_l = (k_l*ro_2)/r_l;
		
var LD_1 = (m_l-1);
		var LD_2 = (n_l-1);

		
		 var ksi=0.0816968312225275*Math.sin(lat*Math.PI/180);
              var U=Math.tan((45+lat/2)*Math.PI/180)/(Math.pow(Math.tan((45+(ksi*180/Math.PI)/2)*Math.PI/180),0.0816968312225275));
              var uk=Math.pow(U,0.777324960141549);
              var dc1=(0.777324960141549*11148732.3803054)/(uk*4656861.75271744);
				
				
		
		document.getElementById('popup-content').innerHTML = '<p id = "klik" >Pozicija klika:</p><code>' + "Koordinate su: " + hdms + " Linearna razmer: " + Math.floor(Math.round(dc1*100))/100; +
      '</code>';
  overlay.setPosition(coordinate);
   }

   else if(projekcija == 'dks'){
    var hdms = proj4(merc, dkg, coordinate);
	var LD1 =proj4(merc, "WGS84", coordinate);
	var lon = LD1[0];
	var lat = LD1[1];
	
	var lin_duz = 0.9999;
        var e_l = 0.0816968312225275;
        var sred_m = 21;
        var fi_r = parseInt(lon)*(Math.PI/180);
        var t_l = Math.tan(fi_r);
        var n_l = e_l*Math.cos(fi_r);
        var C1 = (1+Math.pow(n_l, 2))*Math.pow(Math.cos(fi_r),2)/2;
        var C2 = (5-4*Math.pow(t_l, 2))*Math.pow(Math.cos(fi_r),4)/24;
        var l = (parseInt(lat)-sred_m)*(Math.PI/180);
        var c_l = lin_duz*(1+(C1*Math.pow(l,2))+(C2*Math.pow(l,4)));
        var LD = (c_l-1)*1000;
   document.getElementById('popup-content').innerHTML = '<p id = "klik" >Pozicija klika:</p><code>' + "Koordinate su: " + hdms + " Linearna deformacija: " + LD + 
      '</code>';
  overlay.setPosition(coordinate);
   }
   else if(projekcija == 'merc'){
    var hdms = coordinate;
	
	var LD1 =proj4(merc, "WGS84", coordinate);
	var lon = LD1[0];
	var lat = LD1[1];
		
var a_l = 6378137;
        
var e_l = 0.0818191908426215;
        
var fi_r = parseInt(lon)*(Math.PI/180);  
		
var N_l = a_l/(Math.sqrt(1-((Math.pow(e_l,2)* Math.pow(Math.sin(fi_r),2)))));
		
var m_l = a_l/(N_l*Math.cos(fi_r));
		
var LD = (m_l-1);
	
	
	var dc1=6378137/(6388090.05758611*Math.cos(lat*Math.PI/180));
	
		document.getElementById('popup-content').innerHTML = '<p id = "klik" >Pozicija klika:</p><code>' + "Koordinate su: " + hdms + " Linearna razmer: " + Math.floor(Math.round(dc1*100))/100; +
      '</code>';
  overlay.setPosition(coordinate);
   }
   

 
});

document.getElementById('popup-closer').onclick = function() {
  overlay.setPosition(undefined);
  document.getElementById('popup-closer').blur();
  return false;
};

$(document).ready(function() {
	
	$('#layers input[type=radio]').change(function() {
		var layer = $(this).val();

		if(layer == "osm"){
			map.getLayers().item(0).setVisible(true);
			map.getLayers().item(1).setVisible(false);
		}else{
			map.getLayers().item(0).setVisible(false);
			map.getLayers().item(1).setVisible(true);	
		}
	});

		  
	$("#l-int").change(function() {
		var ischecked= $(this).is(':checked');
		if(ischecked){
		    map.addLayer(vms1);
		} else{
		    map.removeLayer(vms1);
		};
	});

	$("#l-int-b").on('click', function() {
		download_vector_osgl('vezba1:Srpske-reke');
	});

    $("#l-lok").change(function() {
		var ischecked= $(this).is(':checked');
		if(ischecked){
		    map.addLayer(vms2);
		} else{
		    map.removeLayer(vms2);
		};
	});
	$("#l-lok-b").on('click', function() {
		download_vector_osgl('vezba1:Putevi');
	});

	$("#l-rgbv").change(function() {
		var ischecked= $(this).is(':checked');
		if(ischecked){
		    map.addLayer(vms3);
		} else{
		    map.removeLayer(vms3);
		};
	});
	$("#l-rgbv-b").on('click', function() {
		download_raster_osgl('vezba1:Putevi', vms3);
	});

	$("#l-elk").change(function() {
		var ischecked= $(this).is(':checked');
		if(ischecked){
		    map.addLayer(vms4);
		} else{
		    map.removeLayer(vms4);
		}
	});

	$("#l-elk-wfs").change(function() {
		var ischecked= $(this).is(':checked');
		if(ischecked){
		    map.addLayer(vectorEl);
		} else{
		    map.removeLayer(vectorEl);
		};
	});
	$("#l-elk-wfs-b").on('click', function() {
		download_vector_local('vezba1:Vino', vms4);
	});


});

var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          scale:0.2,
          src: 'map-red-pin-png-30.png',
        }))
      });

      vectorEl.setStyle(iconStyle);