Ext.define("wallet.util", {
	date : function(date, format) {
		if (typeof format == "undefined")
			format = "Y年m月d日";
		return Ext.util.Format.date(date, format);
	},
	datetime : function(time) {
		return util.date(new Date(time), "Y-m-d H:i");
	},
	addDays : function(date, days) {
		return Ext.Date.add(date, Ext.Date.DAY, days);
	},
	currency : function(number) {
		return Ext.util.Format.currency(number);
	},
	percent : function(decimal) {
		return Ext.util.Format.number(decimal * 100, "0.00%");
	},
	renderer : function(tpl, build, apply) {
		tpl = new Ext.Template(tpl).compile();
		return function(item) {
			apply.call(this, tpl.apply(build(item)));
		};
	},
	object : function(value) {
		if (!value)
			return "";
		var content = value.type + " | " + value.name;
		if (value.type == "收入")
			content = "<span class='positive'>" + content + "</span>";
		else if (value.type == "支出")
			content = "<span class='negative'>" + content + "</span>";
		else if (value.type == "转账")
			content = "<span class='statistics'>" + content + "</span>";
		return content;
	},
	status : function(value) {
		if (!value)
			return "";
		return "<img src='" + "/resources/images/accept.png"
				+ "' alt='' style='width:14px; height:14px;' />";
	},

	store : function(args) {
		var params = {
			autoLoad : true,
			pageSize : 20,
			proxy : {
				type : "ajax",
				url : args.url,
				reader : {
					root : "data"
				}
			}
		};
		if (typeof args.storeId != "undefined")
			params.storeId = args.storeId;
		if (typeof args.autoLoad != "undefined")
			params.autoLoad = args.autoLoad;
		if (typeof args.fields != "undefined")
			params.fields = args.fields;
		else if (typeof args.model != "undefined")
			params.model = args.model;
		if (typeof args.groupField != "undefined")
			params.groupField = args.groupField;
		if (typeof args.load != "undefined") {
			params.listeners = {
				load : args.load
			};
		}
		return Ext.create("Ext.data.Store", params);
	},

	pie : function(args) {
		var params = {
			xtype : "chart",
			store : args.store,
			animate : true,
			insetPadding : args.padding || 10,
			theme : args.theme || "Base",
			series : [ {
				type : "pie",
				field : args.value,
				showInLegend : true,
				tips : {
					trackMouse : true,
					width : 140,
					renderer : util.renderer(args.tpl, args.build, function(
							string) {
						this.setTitle(string);
					})
				},
				highlight : {
					segment : {
						margin : args.highlight || 10
					}
				},
				label : {
					field : args.name,
					display : "rotate",
					contrast : true
				}
			} ]
		};
		if (args.legend !== false)
			params.legend = {
				position : args.legend || "right"
			};
		if (typeof args.params != "undefined")
			Ext.apply(params, args.params);
		if (typeof args.listeners != "undefined")
			params.listeners = args.listeners;
		return params;
	},

	column : function(args) {
		var params = {
			xtype : "chart",
			store : args.store,
			animate : true,
			axes : [ {
				type : "Numeric",
				position : "left",
				fields : args.value,
				grid : true,
				minimum : 0,
				label : {
					renderer : util.currency
				}
			}, {
				type : "Category",
				position : "bottom",
				fields : args.name,
				label : {
					rotate : {
						degrees : 330
					}
				}
			} ],
			series : [ {
				type : "column",
				xField : args.name,
				yField : args.value,
				label : {
					display : "insideEnd",
					field : args.value,
					renderer : util.currency,
					"text-anchor" : "middle",
					color : "#000"
				},
				tips : {
					trackMouse : true,
					width : 140,
					renderer : util.renderer(args.tpl, args.build, function(
							string) {
						this.setTitle(string);
					})
				},
				renderer : args.renderer
			} ]
		};
		if (typeof args.params != "undefined")
			Ext.apply(params, args.params);
		return params;
	}
});
window.util = Ext.create("wallet.util");

Function.prototype.delegate = function() {
	var func = this, args = arguments;
	return function() {
		return func.apply(this, args);
	};
};

Ext.define("model.account", {
	extend : "Ext.data.Model",
	fields : [ "id", "name", "type", "balance", "defaultIncome",
			"defaultOutlay", "display", "description", "lastUpdate",
			"createTime", "orderNo", "version" ],
	idProperty : "id"
});
Ext.define("model.category", {
	extend : "Ext.data.Model",
	fields : [ "id", "name", "type", "total", "defaults", "checks",
			"description", "lastUpdate", "orderNo", "version" ],
	idProperty : "id"
});
Ext.define("model.record", {
	extend : "Ext.data.Model",
	fields : [ "id", "occurTime", "amount", "category", "description",
			"incomeAccount", "outlayAccount", "fromAccount", "toAccount",
			"version" ],
	idProperty : "id"
});
