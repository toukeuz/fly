/***
 * 
 * Auteur: souleymane keita	
 *	version:0.2
**/
    // variable global 
    var gLocalSearch;
    var gMap;
    var gInfoWindow;
    var gSelectedResults = [];
    var gCurrentResults = [];
    var gSearchForm;
	var longitude;
	var latitude;
	// creation des markers icons . 
    var gYellowIcon = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_yellow.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    var gRedIcon = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_red.png",
      new google.maps.Size(12, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
    var gSmallShadow = new google.maps.MarkerImage(
      "http://labs.google.com/ridefinder/images/mm_20_shadow.png",
      new google.maps.Size(22, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
	 var gMaPosition = new google.maps.MarkerImage("marker_me.png",
      new google.maps.Size(22, 20),
      new google.maps.Point(0, 0),
      new google.maps.Point(6, 20));
	
	 // paramettrage de la map pour la recherche local .
    function OnLoad() {
		getLocation();
		var lg;
		var lat;
		if(longitude){
			lg=longitude;
			lat=latitude;
		}else{
			lg=2.3522219;
			lat=48.8566140;
		}
	   // Initialiasation de la carte par la vue par defaut(position de l'utilisateur ).
		gMap = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(lat, lg),
        zoom: 13,
        mapTypeId: 'roadmap'
      });
	  //creer une infowindow a ouvrir quand on clique sur un marker 
      gInfoWindow = new google.maps.InfoWindow;
      google.maps.event.addListener(gInfoWindow, 'closeclick', function() {
        unselectMarkers();
      });

      // Initialisation de la recherche local 
      gLocalSearch = new GlocalSearch();
      gLocalSearch.setSearchCompleteCallback(null, OnLocalSearch);
	  
    }

    function unselectMarkers() {
      for (var i = 0; i < gCurrentResults.length; i++) {
        gCurrentResults[i].unselect();
      }
    }

    function doSearch() {
      var query = document.getElementById("queryInput").value;
      gLocalSearch.setCenterPoint(gMap.getCenter());
      gLocalSearch.execute(query);
    }

    	// appeller quand les resultats de la rechercher sont retournés,nous effaçons l'ancienne
        //valeur et les resultats sont chargés pour les news elements

    function OnLocalSearch() {
      if (!gLocalSearch.results) return;
      var searchWell = document.getElementById("searchwell");

      // effacer la map et les resultats 
      searchWell.innerHTML = "";
      for (var i = 0; i < gCurrentResults.length; i++) {
        gCurrentResults[i].marker().setMap(null);
      }
     // fermeture de infowindows
      gInfoWindow.close();

      gCurrentResults = [];
      for (var i = 0; i < gLocalSearch.results.length; i++) {
        gCurrentResults.push(new LocalResult(gLocalSearch.results[i]));
      }

      var attribution = gLocalSearch.getAttribution();
      if (attribution) {
        document.getElementById("searchwell").appendChild(attribution);
      }

      
	  // placer le premier resutat sur la carte 
      var first = gLocalSearch.results[0];
      gMap.setCenter(new google.maps.LatLng(parseFloat(first.lat),parseFloat(first.lng)));

    }

   // annuler l'envoie et l'execution de  la recherche ajax
    function CaptureForm(searchForm) {
      gLocalSearch.execute(searchForm.input.value);
      return false;
    }



    // cette class represente le type de resultat retourner par la recherche local 
    
    function LocalResult(result) {
      var me = this;
      me.result_ = result;
      me.resultNode_ = me.node();
      me.marker_ = me.marker();
      google.maps.event.addDomListener(me.resultNode_, 'mouseover', function() {
        //Mettez en surbrillance l'icône du marqueur et le résultat lorsque le résultat est
        //mouseovered. Ne pas enlever toute surbrillance autres en ce moment.
        me.highlight(true);
      });
      google.maps.event.addDomListener(me.resultNode_, 'mouseout', function() {
        // Supprimer le surlignage à moins que ce marqueur est sélectionné (l'info
         //Fenêtre est ouverte).
        if (!me.selected_) me.highlight(false);
      });
      google.maps.event.addDomListener(me.resultNode_, 'click', function() {
        me.select();
       
      });
	  
	  google.maps.event.addDomListener(me.resultNode_, 'dblclick', function() {
		
		 
       if(me.selected_)  me.addfavorite();  // dans le dom 
      });
      document.getElementById("searchwell").appendChild(me.resultNode_);
    }

	
	// fin class LocalResult
    LocalResult.prototype.node = function() {
      if (this.resultNode_) return this.resultNode_;
      return this.html();
    };

    
	// retourne le gmpa marker pour le resultat ,et le cree et lui passe les icons si cela n'a pas ete fait encore 
   
    LocalResult.prototype.marker = function() {
      var me = this;
      if (me.marker_) return me.marker_;
      var marker = me.marker_ = new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(me.result_.lat),
                                         parseFloat(me.result_.lng)),
        icon: gYellowIcon, shadow: gSmallShadow, map: gMap});
      google.maps.event.addListener(marker, "click", function() {
        me.select();
      });
      google.maps.event.addListener(marker,"dblclick",function(){
    	 
    	  me.addfavorite();  // sur la carte
      });
      return marker;
    };

    
	// deselectionne tous les autres marker avant d'avant d'afficher et selectr un autre marker 
    
    LocalResult.prototype.select = function() {
      unselectMarkers();
      this.selected_ = true;
      this.highlight(true);
      gInfoWindow.setContent(this.html(true));
      
      gInfoWindow.open(gMap, this.marker());
    };

    LocalResult.prototype.isSelected = function() {
      return this.selected_;
    };

    // cacher/supprimer les infos quand items n'est plus selectionner.
    LocalResult.prototype.unselect = function() {
      this.selected_ = false;
      this.highlight(false);
    };

	// selectionne le marker et le place dans une liste pour l'ajouter au favoris
   
	LocalResult.prototype.addfavorite=function(){
		
		if(this.selected_){
			
			var x =parseFloat(this.result_.lat);
			var y=parseFloat(this.result_.lng);
			console.log(y);
			console.log(x);
			console.log(this.result_.html);
			
		}else{
			this.select();
			
		}
		 
	};
   
	// retourn le html a afficher dans la section resultat avant de ranger
    LocalResult.prototype.html = function() {
      var me = this;
      var container = document.createElement("div");
      container.className = "unselected";
      container.appendChild(me.result_.html.cloneNode(true));
      return container;
    };

    LocalResult.prototype.highlight = function(highlight) {
      this.marker().setOptions({icon: highlight ? gRedIcon : gYellowIcon});
      this.node().className = "unselected" + (highlight ? " red" : "");
    };

    GSearch.setOnLoadCallback(OnLoad);
    /******
     *  section gestion de la localisation
     */

	// verication de l'activation de la geolocation 
			function getLocation()
		  {
		  if (navigator.geolocation)
			{
			navigator.geolocation.getCurrentPosition(maPosition,showError);
			}
		  else{infogeo.innerHTML="Geolocation is not supported.";}
		  
		}
	// recuperation de la position actuel de l'utilisateur 
		function maPosition(position)
		{
		latitude=position.coords.latitude;
		longitude=position.coords.longitude;
		// Initialiasation de la carte par la vue par defaut(position de l'utilisateur ).
		gMap = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 13,
        mapTypeId: 'roadmap'
      });
	   		doSearch();
		//infogeo.innerHTML=""+ latitude + " " + longitude ;
		
		}
		
	// gestion des erreurs 
		function showError(error)
	  {
	  switch(error.code) 
		{
		case error.PERMISSION_DENIED:
		  infogeo.innerHTML="User denied the request for Geolocation."
		  break;
		case error.POSITION_UNAVAILABLE:
		  infogeo.innerHTML="Location information is unavailable."
		  break;
		case error.TIMEOUT:
		  infogeo.innerHTML="The request to get user location timed out."
		  break;
		case error.UNKNOWN_ERROR:
		  infogeo.innerHTML="An unknown error occurred."
		  break;
		}
	  }
	  
	
	/**
	 * fin section 
	 */
	
	/****
	 * section 3 
	 * creer et position un element de la liste des favoris sur la carte  à l'aide d'une infowindow
	 * 
	 */	
/*	
		google.maps.event.addDomListener(window, 'load', function() {
		    var map = new google.maps.Map(document.getElementById('map'), {
		      zoom: 13,
		      center: new google.maps.LatLng(37.789879, -122.390442),
		      mapTypeId: google.maps.MapTypeId.ROADMAP
		    });

		    var infoWindow = new google.maps.InfoWindow;

		    var onMarkerClick = function() {
		      var marker = this;
		      var latLng = marker.getPosition();
		      infoWindow.setContent('<h5>hotel:</h5>' +
		          latLng.lat() + ', ' + latLng.lng());

		      infoWindow.open(map, marker);
		    };
		    google.maps.event.addListener(map, 'click', function() {
		      infoWindow.close();
		    });

		    var favoritemarker = new google.maps.Marker({
		      map: map,
		      position: new google.maps.LatLng(37.789879, -122.390442)
		    });
		   

		    google.maps.event.addListener(favoritemarker, 'click', onMarkerClick);
		    
		  });
	*/
	


