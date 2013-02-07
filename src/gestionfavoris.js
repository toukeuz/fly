
// variable globale 
var AllFavorites=new Array();


function add(element){
	//ajoute le favori dans la base de donnee
	
 var nouvel_element = new Favorite("1222",conteneur);
 AllFavorites.push(nouvel_element);
 var container = document.getElementById("arrayfav");
 container.className = "favoris";
 container.appendChild(nouvel_element.toString());
 
}

function remove(){
var compteselect=0;
	for(yo=0;yo<document.formulaire.liste.length;yo++){
		if(document.formulaire.liste.options[yo].selected == true){
		compteselect++;
		}
		if(compteselect>0){
			for(yo=0;yo<document.formulaire.liste.length;yo++){
				if(document.formulaire.liste.options[yo].selected == true){
				document.formulaire.liste.options[yo] = null;
				}
			}
		remove();
		}
	}
}

/**
 *  class representant un favoris
 * @param latlog
 * @param contenthtml
 * @returns
 */
function Favorite(latlog, contenthtml){
	
	this.key_=null;
	this.latlog_=latlog;
	this.content_=contenthtml;
	this.isFavorite_=true;
}

/**
 * 
 * @returns
 */
Favorite.prototype.getkey=function(){
	return this.key_;
};


Favorite.prototype.getLatlog=function(){
	return this.latlog_;
};

Favorite.prototype.getContent=function(){
	return this.content_;
};

Favorite.prototype.Isfavorite=function(){
	return this.isFavorite_;
};

Favorite.prototype.unfavorite=function(){
	 this.isFavorite_=false;
};

Favorite.prototype.toString=function(){
	return ( this.latlog_ + " "+ this.content_ +" " + this.getkey());
};

/*
 * class representant tous les favoris
 */
function ArrayFavorite(){
	
	this.myliste=new Array();
	
	// supprime un element dans array en lui passant le key
	this.myliste.prototype.remove=function(val){
		
		if(this.myliste.length!=0){
			
			var currentElem;
			for(var i=0;this.myliste.length;i++){
				
				currentElem=this.myliste[i];
				var key=currentElem.getkey();
				if(key==val){
					this.myliste[i]=null;
					break;
				}
			}
		}
	};

}

/*
 * return la liste de tous les hotes se trouvant dans la liste
 */
ArrayFavorite.prototype.getlist=function(){
	return this.myliste;
	// prevoir in crud vers indexdb
};
