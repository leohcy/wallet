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
				flex : 1,
				margin : "3 3 0 3",
				bodyStyle : "background:#DFE8F6",
				border : false,
				layout : {
					type : "hbox",
					align : "stretch"
				},
				items : [ {
					flex : 3
				}, this.initPie() ]
			}, this.initGrid() ]
		});
		this.callParent(arguments);
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
			legend : false,
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
		var panel = this;
		var fields = [ "monday", "sunday", "total" ];
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
		var store = util.store({
			fields : fields,
			url : "/statistics/latestWeekOutlay",
			load : function() {
				panel.down("grid").getSelectionModel().select(0);
			}
		});
		store.proxy.extraParams = {
			weeks : 24
		};
		return {
			xtype : "grid",
			flex : 1,
			margin : "3",
			loadMask : true,
			forceFit : true,
			store : store,
			columns : columns,
			listeners : {
				selectionchange : function() {
					var sm = this.getSelectionModel();
					if (sm.getCount() == 1)
						panel.select(sm.getSelection()[0]);
				}
			}
		};
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
