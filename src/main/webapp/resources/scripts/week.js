Ext.define("wallet.week", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "周统计",
			bodyStyle : "background:#DFE8F6",
			layout : {
				type : "vbox",
				align : "stretch"
			},
			items : [ {
				flex : 3,
				margin : "3 3 0 3",
				bodyStyle : "background:#DFE8F6",
				border : false,
				layout : {
					type : "hbox",
					align : "stretch"
				},
				items : [ this.initColumn(), this.initPie() ]
			}, this.initGrid() ]
		});
		this.callParent(arguments);
	},

	initColumn : function() {
		var store = this.colStore = Ext.create("Ext.data.ArrayStore", {
			fields : [ "year", "week", "range", "amount", "total" ]
		});
		return util.column({
			params : {
				flex : 3
			},
			store : store,
			name : "range",
			value : "amount",
			orientation : "vertical",
			degrees : 270,
			label : function(value) {
				return value.toFixed(2);
			},
			tpl : "{0}年第{1}周<br/>({2})<br/>消费：{3}<br/>比重：{4}",
			build : function(item) {
				return [ item.get("year"), item.get("week"), item.get("range"),
						util.currency(item.get("amount")),
						util.percent(item.get("amount") / item.get("total")) ];
			},
			renderer : function(sprite, record, attr, index, store) {
				var amount = record.get("amount");
				var color = "rgb(146, 6, 157)";
				if (amount < 200)
					color = "rgb(44, 153, 201)";
				else if (amount < 400)
					color = "rgb(49, 149, 0)";
				else if (amount < 600)
					color = "rgb(249, 153, 0)";
				else if (amount < 800)
					color = "rgb(213, 70, 121)";
				return Ext.apply(attr, {
					fill : color
				});
			}
		});
	},

	initPie : function() {
		var store = this.pieStore = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name", "amount" ]
		});
		return util.pie({
			params : {
				flex : 1
			},
			store : this.pieStore,
			name : "name",
			value : "amount",
			tpl : "分类：{0}<br/>金额：{1}<br/>比重：{2}",
			build : function(item) {
				return [ item.get("name"), util.currency(item.get("amount")),
						util.percent(item.get("amount") / store.sumAmount) ];
			},
			highlight : 5,
			listeners : {
				beforerefresh : function() {
					this.series.items[0].labelsGroup.each(function(label) {
						label.hide(true);
					});
				}
			}
		});
	},

	initGrid : function() {
		Ext.define("wallet.grid.HeaderButton", {
			extend : "Ext.grid.feature.Feature",
			alias : "feature.headerbutton",
			attachEvents : function() {
				this.view.headerCt.on("menucreate", function(headerCt, menu) {
					menu.add("-");
					menu.add(this.button);
				}, this);
			}
		});
		var panel = this;
		var fields = [ "year", "week", "monday", "sunday", "total" ];
		var columns = [ {
			xtype : "rownumberer"
		}, {
			text : "开始时间",
			dataIndex : "monday",
			width : 80,
			menuDisabled : true,
			hideable : false,
			renderer : util.date
		}, {
			text : "结束时间",
			dataIndex : "sunday",
			width : 80,
			menuDisabled : true,
			hideable : false,
			renderer : util.date
		}, {
			text : "总额",
			dataIndex : "total",
			width : 70,
			hideable : false,
			renderer : util.currency
		} ];
		this.categories = {};
		for ( var category in this.params) {
			var idx = "c" + this.params[category].id;
			this.categories[idx] = this.params[category].name;
			fields.push(idx);
			columns.push({
				text : this.params[category].name,
				dataIndex : idx,
				width : 70,
				hideable : false,
				renderer : util.currency
			});
		}
		panel.current = "total";
		var store = util.store({
			fields : fields,
			url : "/statistics/latestWeekOutlay",
			load : this.loadData.delegate(this)
		});
		store.proxy.extraParams = {
			weeks : 24
		};
		return {
			xtype : "grid",
			flex : 2,
			margin : "3",
			loadMask : true,
			forceFit : true,
			store : store,
			columns : columns,
			features : [ {
				ftype : "headerbutton",
				button : {
					text : "统计该类型",
					iconCls : "icon-month-stats",
					handler : function() {
						panel.current = this.parentMenu.activeHeader.dataIndex;
						panel.loadData.call(store, panel);
					}
				}
			} ],
			listeners : {
				selectionchange : function() {
					var sm = this.getSelectionModel();
					if (sm.getCount() == 1)
						panel.select(sm.getSelection()[0]);
				}
			}
		};
	},
	loadData : function(panel) {
		var data = [];
		this.each(function(record) {
			var range = util.datef(record.get("monday"), "m/d") + "~"
					+ util.datef(record.get("sunday"), "m/d");
			data.push([ record.get("year"), record.get("week"), range,
					record.get(panel.current), record.get("total") ]);
		});
		data.reverse();
		panel.colStore.loadData(data);
		panel.down("grid").getSelectionModel().select(0);
	},
	select : function(record) {
		var data = [];
		for ( var category in this.categories)
			if (record.get(category) > 0)
				data.push([ this.categories[category], record.get(category) ]);
		Ext.Array.sort(data, function(a, b) {
			return b[1] - a[1];
		});
		this.pieStore.loadData(data);
		this.pieStore.sumAmount = this.pieStore.sum("amount");
	}
});
