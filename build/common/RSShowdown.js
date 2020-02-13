

/**
 * 
 * @class RSShowdown
 * @constructor
 * @module Common
 * @see Showdown: https://www.npmjs.com/package/showdown
 * @see Markdown: https://www.markdownguide.org/
 */
(function() {
	var converter = new showdown.Converter();

	var marking = {
		"start": "${",
		"end": "}$"
	};
	
	var formatMarkdown = function(sourceText, universe, entity, base, targetObject) {
//		console.warn("Formatting Markdown: " + sourceText, universe, entity, base, targetObject);
		var properties,
			tracking,
			element,
			target,
			value,
			index,
			mark,
			end,
			x;

		index = sourceText.indexOf(marking.start);
		while(index !== -1 && (end = sourceText.indexOf(marking.end, index)) !== -1 && index + 3 < end) {
			tracking = sourceText.substring(index, end + 2);
			target = sourceText.substring(index + 2, end);
			properties = {};
			
			mark = target.indexOf(",");
			if(mark === -1) {
				value = target;
			} else {
				value = target.split(",");
				switch(value.length) {
					default:
					case 4:
						base = universe.index.lookup[value[3]];
					case 3:
						properties.id = value[2];
					case 2:
						properties.classes = value[1];
					case 1:
						value = value[0];
				}
			}
			
			if(value) {
//				console.warn("Calculating Expression: " + value, universe, entity, base, targetObject);
				if(value[0] === "=") {
					value = universe.calculateExpression(value.substring(1), entity, base, targetObject);
					
					element = $("<span class=\"calculated-result rendered-value " + properties.classes + "\">" + value + "</span>");
				} else if(value[0] === "~") {
					value = value.substring(1).split(".");
					if(value.length === 2) {
						switch(value[0]) {
							case "base":
								value = base[value[1]] || "";
								break;
							case "target":
								value = targetObject[value[1]] || "";
								break;
							default:
								value = entity[value[1]] || "";
								break;
						}
					} else {
						value = entity[value[0]] || "";
					}
					element = $("<span class=\"" + properties.classes + "\">" + value + "</span>");
				} else if(value[0] === "#") {
					value = value.substring(1).trim();
					if(value && (value = universe.index.index[value])) {
						value = value.icon;
					} else if(entity) {
						value = entity.icon;
					}
					if(!value) {
						value = "";
					}
					element = $("<span class=\"" + value + "\"></span>");
				} else {
					// Linked
					mark = universe.index.index[properties.id || value];
					if(mark) {
						element = $("<a class=\"rendered-value linked-value " + properties.classes + "\" data-id=\"" + (properties.id || mark.id) + "\">" + value + "</a>");
					} else {
						element = $("<span class=\"calculated-result rendered-value " + properties.classes + " not-found\">" + value + "[Not Found]</span>");
					}
				}
//				console.warn("Properties: ", properties);
				if(properties.classes) {
					element.css(properties.classes);
				}
				
				sourceText = sourceText.replace(tracking, element[0].outerHTML);
			}
			
			index = sourceText.indexOf(marking.start, index + 1);
		}
		
		return sourceText;
	};
	
	rsSystem.component("RSShowdown", {
		"inherit": true,
		"props": {
			"universe": {
				"required": true,
				"type": Object
			}
		},
		"methods": {
			"rsshowdown": function(sourceText, entity, base, target) {
//				console.warn("RS Showdown: ", entity, base, target);
				return converter.makeHtml(formatMarkdown(sourceText, this.universe, entity, base, target));
			}
		}
	});
})();
