
/**
 * 
 * 
 * @class rsNoun
 * @constructor
 * @module Components
 */
(function() {
	var storageKey = "_rs_nounComponentKey";
	
	var spacing = / /g;
	
	/**
	 * Fill out item to complete fields.
	 * @method completeItem
	 * @param {Object} item
	 */
	var completeItem = function(type, item) {
		if(!item.id) {
			if(!item.name) {
				throw new Error("No ID or name");
			} else {
				item.id = type + ":" + item.name.toLowerCase().replace(spacing, "");
			}
		}
		
		item.id = item.id.toLowerCase().trim();
		if(item.name) {
			item.name = item.name.trim();
		}
		
		return item;
	};
	
	rsSystem.component("rsNouns", {
		"inherit": true,
		"mixins": [
			rsSystem.components.StorageManager,
			rsSystem.components.DataManager,

			rsSystem.components.NounFieldsModifierStats,
			rsSystem.components.NounFieldsKnowledge,
			rsSystem.components.NounFieldsLocation,
			rsSystem.components.NounFieldsAbility,
			rsSystem.components.NounFieldsEffect,
			rsSystem.components.NounFieldsRace,
			rsSystem.components.NounFieldsItem,
			rsSystem.components.NounFieldsNote
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"player": {
				"required": true,
				"type": Object
			},
			"built": {
				"type": Object
			}
		},
		"data": function() {
			var data = {},
				x;

			data.attaching = null;
			data.rawValue = "{}";
			data.message = null;
			data.isValid = true;
			data.copy = null;
			data.nouns = rsSystem.listingNouns.sort();
			data.state = this.loadStorage(storageKey, {
				"current": "player",
				"building": {}
			});
//			console.log("Loaded Data[" + storageKey + "]: ", data.state);
			
			for(x=0; x<data.nouns.length; x++) {
				if(!data.state.building[data.nouns[x]]) {
					data.state.building[data.nouns[x]] = {};
				}
			}
			
			data.extra_properties = [];
			
			return data;
		},
		"watch": {
			"copy": function(value) {
				if(value) {
//					var copy = this.copyNoun(this.universe.nouns[this.state.current][value]);
					Vue.set(this, "rawValue", this.universe.nouns[this.state.current][value]?JSON.stringify(this.universe.nouns[this.state.current][value].toJSON(), null, 4):"{}");
					Vue.set(this, "copy", null);
				}
			},
			"state.current": function(n, p) {
				console.warn("Noun: ", n, p);
				if(this.state.building[n]) {
					Vue.set(this, "rawValue", JSON.stringify(this.state.building[n], null, "\t"));
				} else {
					Vue.set(this, "rawValue", {});
				}
			},
			"rawValue": function(value) {
				try {
					var parsed = JSON.parse(value),
						keys,
						x;
					
					Vue.set(this.state.building, this.state.current, parsed);
					this.saveStorage(storageKey, this.state);
					Vue.set(this, "message", null);
					Vue.set(this, "isValid", true);
					
					if(this.built) {
						console.warn("Sync Built: ", this.built);
						keys = Object.keys(this.built);
						for(x=0; x<keys.length; x++) {
							Vue.set(this.built, keys[x], null);
						}
						keys = Object.keys(parsed);
						for(x=0; x<keys.length; x++) {
							Vue.set(this.built, keys[x], parsed[keys[x]]);
						}
					}
					
				} catch(exception) {
					Vue.set(this, "message", "Invalid: " + exception.message);
					Vue.set(this, "isValid", false);
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			if(this.state.building[this.state.current]) {
				Vue.set(this, "rawValue", JSON.stringify(this.state.building[this.state.current], null, "\t"));
			} else {
				Vue.set(this, "rawValue", "{}");
			}
		},
		"methods": {
			"clearField": function(field) {
				Vue.set(this.state.building[this.state.current], field.property, null);
				if(this.built) {
					Vue.set(this.built, field.property, null);
				}
			},
			"openKnowledge": function(id) {
				if(this.universe.index.index[id]) {
					rsSystem.EventBus.$emit("display-info", this.universe.index.index[id]);
				} else {
					console.warn("ID Not Found for Knowledge: ", id);
				}
			},
			"sync": function(event) {
				console.warn("Sync: ", event);
				if(this.built) {
					Vue.set(this.built, event.property, event.value);
				}
			},
			"newObject": function() {
				var keys = this.state.building[this.state.current],
					x;

				if(this.built) {
					for(x=0; x<keys.length; x++) {
						Vue.delete(this.state.building[this.state.current], keys[x]);
						Vue.set(this.built, keys[x], null);
					}
				} else {
					for(x=0; x<keys.length; x++) {
						Vue.delete(this.state.building[this.state.current], keys[x]);
					}
				}
				
				Vue.set(this, "rawValue", "{}");
			},
			"dropObject": function() {
				this.state.building[this.state.current]._type = this.state.current;
				this.universe.send("delete:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current]));
			},
			"fileAttach": function(event) {
				console.warn("Noun File Attach: ", event);
				try {
					var file = event.items[0].getAsFile();
					console.warn("File: ", file);
				} catch(exception) {
					console.error("Ex: ", exception);
				}
			},
			"selectImage": function(event) {
				var input = $(this.$el).find("#attacher"),
					value,
					keys,
					x;
				
				if(this.state.current === "image" && input && input.length && input[0].files.length) {
					console.warn("Set Image");
					if(this.state.building[this.state.current]) {
						keys = Object.keys(this.state.building[this.state.current]);
						if(this.built) {
							for(x=0; x<keys.length; x++) {
								Vue.delete(this.state.building[this.state.current], keys[x]);
								Vue.set(this.built, keys[x], null);
							}
						} else {
							for(x=0; x<keys.length; x++) {
								Vue.delete(this.state.building[this.state.current], keys[x]);
							}
						}
					}
					
					value = {};
					this.encodeFile(input[0].files[0])
					.then((result) => {
						value.data = result.data;
						result.name = result.name.substring(0, result.name.lastIndexOf("."));
						value.id = "image:" + result.name.replace(/\./g, ":");
						value.name = result.name;
						Vue.set(this, "rawValue", JSON.stringify(value, null, 4));
						input[0].value = null;
						console.warn("New Value: ", value);
					});
				}
			},
			"toggleEditMode": function() {
				var parsed,
					keys,
					x;
				
				if(this.state.advanced_editor) {
					try {
						parsed = JSON.parse(this.rawValue);
						keys = Object.keys(this.state.building[this.state.current]);
						for(x=0; x<keys.length; x++) {
							Vue.delete(this.state.building[this.state.current], keys[x]);
						}
						
						keys = Object.keys(parsed);
						for(x=0; x<keys.length; x++) {
							Vue.set(this.state.building[this.state.current], keys[x], parsed[keys[x]]);
						}
					} catch(ex) {
						console.error("Parse Failed: ", ex);
						Vue.set(this, "error", ex.message);
					}
					Vue.set(this.state, "advanced_editor", false);
				} else {
					Vue.set(this, "rawValue", JSON.stringify(this.state.building[this.state.current], null, 4));
					Vue.set(this.state, "advanced_editor", true);
				}
			},
			"copyNoun": function(source) {
				var result = {},
					keys = Object.keys(source),
					x;
				
				for(x=0; x<keys.length; x++) {
					if(keys[x] && keys[x][0] !== "_") {
						result[keys[x]] = source[keys[x]];
					}
				}
				
				return result;
			},
			"saveEvent": function(event) {
				console.warn("Save?", event);
				if(event.code === "KeyS" && event.ctrlKey) {
					console.warn("Save");
					this.modify();
					event.stopPropagation();
					event.preventDefault();
					return false;
				}
			},
			"modify": function() {
//				console.warn("modify: ", event);
				
				if(this.isValid) {
//					console.log("valid");
					if(this.state.building[this.state.current] instanceof Array) {
//						console.log("array");
						for(var x=0; x<this.state.building[this.state.current].length; x++) {
//							console.warn("sync: ", this.state.building[this.state.current][x]);
							this.state.building[this.state.current][x]._type = this.state.current;
							this.universe.send("modify:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current][x]));
						}
					} else {
//						console.warn("sync: ", this.state.building[this.state.current]);
						this.state.building[this.state.current]._type = this.state.current;
						this.universe.send("modify:" + this.state.current, completeItem(this.state.current, this.state.building[this.state.current]));
					}
				}
			}
		},
		"template": Vue.templified("components/nouns.html")
	});
})();
