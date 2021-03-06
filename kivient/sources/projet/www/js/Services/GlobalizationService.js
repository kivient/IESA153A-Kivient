var GlobalizationService = {

	wording : {
		'name'				: { 'en' : 'Name', 
								'fr' : 'Nom' 
							  },
		'firstname'			: { 'en' : 'Firstname',
								'fr' : 'Prénom'
							  },
		'lastname'			: { 'en' : 'Lastname',
								'fr' : 'Nom'
							  },
		'drink' 			: { 'en' : 'Drink', 
								'fr' : 'Apéro' 
							  },
		'participate' 		: { 'en' : 'Participate', 
								'fr' : 'Participer' 
							  },
		'create-new-event' : { 'en' : 'Create new event',
								'fr' : 'Créer un évènement'
							  },
		'new-event' 		: { 'en' : 'New event',
								'fr' : 'Nouvel évènement'
							  },
		'start'				: { 'en' : 'Start',
								'fr' : 'Début'
							  },
		'end'				: { 'en' : 'End',
								'fr' : 'Fin'
							  },
		'adress'			: { 'en' : 'Adress',
								'fr' : 'Adresse'
							  },
		'cp'				: { 'en' : 'Zip Code',
								'fr' : 'Code postal'
							  },
		'city'				: { 'en' : 'City',
								'fr' : 'Ville'
							  },
		'create'			: { 'en' : 'Create',
								'fr' : 'Créer'
							  },
		'events-list'		: { 'en' : 'Events list',
								'fr' : 'Flux d\'évènements'
							  },
		'langage'			: { 'en' : 'Version française',
								'fr' : 'English version'
							  },
		'update'			: { 'en' : 'Update',
								'fr' : 'Modifier'
							  },
		'infos-uodated'		: { 'en' : 'Your informations has been updated',
								'fr' : 'Vos informations ont été modifiées'
							  },
		'share'				: { 'en' : 'Share on Twitter',
								'fr' : 'Partager sur Twitter'
							  },
	},


	translate : function(locale, word) 
	{
		return this.wording[word][locale];
	}

};