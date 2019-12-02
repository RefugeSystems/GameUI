
(function() {
	
	var dataSource,
		profiles,
		attrs,
		stats,
		items,
		notes;

	profiles = {
		"label": "Profile",
		"property": "profile",
		"type": "select",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	items = {
		"label": "Items",
		"property": "item",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name",
		"filter": {
			"template": true
		}
	};
	
	attrs = {
		"label": "Attributes",
		"property": "modifierattrs",
		"type": "multireference",
		"optionValue": "id",
		"optionLabel": "name"
	};
	
	stats = {
		"label": "Stats",
		"property": "modifierstats",
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
		"label": "Icon",
		"property": "icon",
		"knowledge": "knowledge:system:icons",
		"type": "text"
	}, {
		"label": "State",
		"property": "state",
		"type": "select",
		"raw": true,
		"options": [
			"undiscovered",
			"pending",
			"active",
			"completed"
		]
	}, {
		"label": "Hidden",
		"property": "hidden",
		"type": "checkbox"
	},
	profiles,
	attrs,
	stats,
	items,
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
	
	rsSystem.component("NounFieldsKnowledge", {
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
			data.fields.knowledge = dataSource;
			

			return data;
		},
		"mounted": function() {
			profiles.options = this.universe.indexes.image.listing;
			profiles.options.sortBy("name");

			attrs.source_index = this.universe.indexes.modifierattrs;
			stats.source_index = this.universe.indexes.modifierstats;
			notes.source_index = this.universe.indexes.note;
			items.source_index = this.universe.indexes.item;
		},
		"methods": {
			"update": function() {
				
			}
		},
		"beforeDestroy": function() {
			
		}
	});
})();