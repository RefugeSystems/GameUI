
/**
 * 
 * 
 * @class systemInfo
 * @constructor
 * @module Components
 * @zindex 20
 */
(function() {
	var storageKey = "_rs_infoComponentKey";
	
	rsSystem.component("systemInfo", {
		"inherit": true,
		"mixins": [
			rsSystem.components.RSCore
		],
		"props": {
			"universe": {
				"required": true,
				"type": Object
			},
			"user": {
				"required": true,
				"type": Object
			},
			"options": {
				"type": Object,
				"default": function() {
					return {};
				}
			}
		},
		"data": function() {
			var data = {};
			
			/**
			 * 
			 * @property viewing
			 * @type RSObject
			 */
			data.viewing = null;
			/**
			 * 
			 * @property open
			 * @type Boolean
			 */
			data.open = false;
			/**
			 * Stores viewed records to go back to while the panel is open.
			 * @property history
			 * @type Array
			 */
			data.history = [];
			/**
			 * Used for calculations.
			 * @property source
			 * @type Object
			 */
			data.source = null;
			/**
			 * Used for calculations.
			 * @property target
			 * @type Object
			 */
			data.target = null;
			/**
			 * Used for calculations.
			 * @property base
			 * @type Object
			 */
			data.base = null;
			
			return data;
		},
		"watch": {
			"record": {
				"deep": true,
				"handler": function() {
					console.warn("hold");
				}
			}
		},
		"mounted": function() {
			rsSystem.register(this);
			rsSystem.EventBus.$on("display-info", this.displayRecord);
			this.universe.$on("universe:modified", this.update);
		},
		"methods": {
			/**
			 * 
			 * @method displayRecord
			 * @param {RSObject | Object | String} toView Something to identify the RSObject to view or the object itself.
			 */
			"displayRecord": function(toView) {
				if(toView && !(toView instanceof RSObject)) {
					if(toView.record) {
						console.warn("Received View Record: ", toView);
						Vue.set(this, "target", toView.target);
						Vue.set(this, "source", toView.source);
						Vue.set(this, "base", toView.source);
						if(typeof(toView.record) === "string") {
							toView = this.universe.index.index[toView.record];
						} else {
							toView = toView.record;
						}
					} else {
						if(typeof(toView) === "string") {
							toView = this.universe.index.index[toView];
						} else {
							toView = this.universe.index.index[toView.id] || this.universe.index.index[toView.name];
						}
						Vue.set(this, "target", undefined);
						Vue.set(this, "source", undefined);
						Vue.set(this, "base", undefined);
					}
				}
				
				if(toView && (!this.viewing || toView.id !== this.viewing.id)) {
					if(this.viewing) {
						if(!this.history.length || (this.viewing.id !== toView.id)) {
							this.history.unshift(this.viewing);
						} else {
							console.warn("Repeated Shift? ", this.viewing.id);
						}
						if(this.viewing.$off) {
							this.viewing.$off("modified", this.update);
						}
					}
					
					Vue.set(this, "viewing", toView);
					Vue.set(this, "open", true);

					if(this.viewing.$on) {
						this.viewing.$on("modified", this.update);
					}
				}
			},
			
			"processRequest": function(event) {
				
				
			},
			"backOne": function() {
				if(this.history.length) {
					console.warn("Back[" + this.history.length + "]: ", this.history[0].id);
					Vue.set(this, "viewing", this.history.shift());
					console.warn("Waiting[" + this.history.length + "]: ", this.history[0]?this.history[0].id:null);
					this.update();
				}
			},
			/**
			 * 
			 * @method closeInfo
			 */
			"closeInfo": function() {
				Vue.set(this, "viewing", null);
				Vue.set(this, "open", false);
				this.history.splice(0);
			},
			/**
			 * 
			 * @method update
			 */
			"update": function() {
				this.$forceUpdate();
			}
		},
		"beforeDestroy": function() {
			this.universe.$off("universe:modified", this.update);
		},
		"template": Vue.templified("components/info.html")
	});
})();
