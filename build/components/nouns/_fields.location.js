
(function() {
	
	var classifications,
		dataSource,
		knowledges,
		location,
		profiles,
		images,
		notes;
	
	location = {
		"label": "Resides In",
		"property": "location",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	profiles = {
		"label": "Profile",
		"property": "profile",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	images = {
		"label": "Image",
		"property": "image",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};

	classifications = {
		"label": "Available Item Classifications",
		"property": "classification",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	knowledges = {
		"label": "Knowledge",
		"property": "knowledge",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	notes = {
		"label": "Notes",
		"property": "note",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	dataSource = [{
		"label": "ID",
		"property": "id",
		"type": "text"
	}, {
		"label": "Name",
		"property": "name",
		"type": "text"
	}, {
		"label": "Label",
		"property": "label",
		"type": "text"
	}, {
		"label": "Icon",
		"property": "icon",
		"knowledge": "knowledge:system:icons",
		"type": "text"
	}, {
		"label": "Type",
		"property": "type",
		"type": "select",
		"raw": true,
		"options": [
			"building",
			"city",
			"marker",
			"moon",
			"planet",
			"station"
		]
	}, {
		"label": "Hidden",
		"property": "hidden",
		"type": "checkbox"
	}, {
		"label": "X Coordinate",
		"property": "x",
		"type": "number"
	}, {
		"label": "Y Coordinate",
		"property": "y",
		"type": "number"
	}, {
		"label": "Size",
		"property": "size",
		"type": "number"
	}, {
		"label": "Link",
		"property": "linked",
		"type": "select",
		"raw": true,
		"options": [
			"map"
		]
	},
	location,
	profiles,
	images,
	classifications,
	{
		"label": "Restock Base",
		"property": "restock_base",
		"type": "number"
	}, {
		"label": "Restock Max",
		"property": "restock_max",
		"type": "number"
	}, {
		"label": "Rarity Min",
		"property": "rarity_min",
		"type": "number"
	}, {
		"label": "Rarity Max",
		"property": "rarity_max",
		"type": "number"
	},
	knowledges,
	{
		"label": "Description",
		"property": "description",
		"type": "textarea"
	},
	notes,
	{
		"label": "Master Note",
		"property": "master_note",
		"type": "textarea"
	}];
	
	rsSystem.component("NounFieldsLocation", {
		"inherit": true,
		"props": {
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"data": function() {
			var data = {};
			data.fields = this.fields || {};
			data.fields.location = dataSource;
			

			return data;
		},
		"mounted": function() {
			location.options = this.universe.indexes.location.listing;
			location.options.sortBy("name");
			profiles.options = this.universe.indexes.image.listing;
			profiles.options.sortBy("name");
			images.options = this.universe.indexes.image.listing;
			images.options.sortBy("name");

			classifications.source_index = this.universe.indexes.classification;
			knowledges.source_index = this.universe.indexes.knowledge;
			notes.source_index = this.universe.indexes.note;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();
