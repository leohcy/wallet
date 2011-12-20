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
				}, {
					flex : 1
				} ]
			}, this.initGrid() ]
		});
		this.callParent(arguments);
	},

	initGrid : function() {
		var fields = [ "monday", "sunday", "total" ];
		var columns = [ {
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
		for ( var category in this.params) {
			var idx = "c" + this.params[category].id;
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
			url : "/statistics/latestWeekOutlay"
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
			columns : columns
		};
	}
});
