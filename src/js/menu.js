			function envoieRequete(url, id, onglet){
				var xhr_object = null;
				var position = id;
				var onglets = ["home", "search", "favoris", "help", "about"];
				
				if(window.XMLHttpRequest) xhr_object = new XMLHttpRequest();
				/*
					else if (window.ActiveXObject) xhr_object = new ActiveXObject("Microsoft.XMLHTTP");
				*/
				
				
				// On ouvre la requete vers la page d�sir�e
				xhr_object.open("GET", url, true);
				xhr_object.onreadystatechange = function(){
				if ( xhr_object.readyState == 4 )
					{
					// j'affiche dans la DIV sp�cifi�e le contenu retourn� par le fichier
					 document.getElementById(position).innerHTML = xhr_object.responseText;
					 alert(xhr_object.responseText);
					}
				}
				// dans le cas du get
				xhr_object.send(null);
				
				//Activation/d�sactivation des onglets
				for(var i = 0; i < onglets.length; i++)
				{	
					if ( onglet == onglets[i] )
						document.getElementById(onglet).className = "active";
					else
						document.getElementById(onglets[i]).className = "inactive";
				}
				
			}
			