Ext.define("wallet.home", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "首页",
			bodyStyle : "background:#DFE8F6",
			layout : {
				type : "hbox",
				align : "stretch"
			},
			items : [ this.initAsset(), this.initOutlay() ]
		});
		this.callParent(arguments);
	},

	initAsset : function() {
		var store = util.store({
			model : "model.account",
			url : "/account/displayed",
			load : function() {
				this.sumBalance = this.sum("balance");
				var sum = util.currency(this.sumBalance);
				Ext.getCmp("home-assets-sum").setText(
						"资产：<span class='statistics'>" + sum + "</span>");
			}
		});
		var grid = {
			xtype : "grid",
			flex : 2,
			border : false,
			loadMask : true,
			forceFit : true,
			store : store,
			columns : [ {
				text : "名称",
				dataIndex : "name",
				width : 120,
				menuDisabled : true
			}, {
				text : "余额",
				dataIndex : "balance",
				width : 120,
				menuDisabled : true,
				renderer : util.currency
			}, {
				text : "最后更新时间",
				dataIndex : "lastUpdate",
				width : 160,
				menuDisabled : true,
				renderer : util.datetime
			} ]
		};
		var chart = util.column({
			params : {
				flex : 3
			},
			store : store,
			name : "name",
			value : "balance",
			tpl : "账户：{0}<br/>余额：{1}<br/>比重：{2}",
			build : function(item) {
				return [ item.get("name"), util.currency(item.get("balance")),
						util.percent(item.get("balance") / store.sumBalance) ];
			},
			renderer : function(sprite, record, attr, index, store) {
				var balance = record.get("balance");
				var color = "rgb(44, 153, 201)";
				if (balance < 20)
					color = "rgb(146, 6, 157)";
				else if (balance < 80)
					color = "rgb(213, 70, 121)";
				else if (balance < 200)
					color = "rgb(249, 153, 0)";
				else if (balance < 800)
					color = "rgb(49, 149, 0)";
				return Ext.apply(attr, {
					fill : color
				});
			}
		});
		return {
			flex : 2,
			margin : "3",
			title : "资产状况",
			layout : {
				type : "vbox",
				align : "stretch"
			},
			items : [ grid, chart ],
			bbar : [ {
				text : "刷新",
				iconCls : "icon-reload",
				handler : function() {
					store.load();
				}
			}, "->", {
				xtype : "tbtext",
				id : "home-assets-sum",
				text : "资产：<span class='statistics'>￥0.00</span>"
			} ]
		};
	},

	initOutlay : function() {
		var store = util.store({
			fields : [ "name", "amount" ],
			url : "/statistics/latest30DaysOutlay",
			load : function() {
				this.sumValue = this.sum("amount");
				var sum = util.currency(this.sumValue);
				Ext.getCmp("home-outlay-sum").setText(
						"消费：<span class='statistics'>" + sum + "</span>");
			}
		});
		var chart = util.pie({
			store : store,
			name : "name",
			value : "amount",
			tpl : "分类：{0}<br/>金额：{1}<br/>比重：{2}",
			build : function(item) {
				return [ item.get("name"), util.currency(item.get("amount")),
						util.percent(item.get("amount") / store.sumValue) ];
			},
			padding : 40,
			highlight : 20
		});
		var range = util.datef(util.addDays(new Date(), -30)) + " ~ "
				+ util.datef(new Date());
		return {
			flex : 3,
			margin : "3 3 3 0",
			title : "近30日消费分布",
			layout : "fit",
			items : [ chart ],
			bbar : [ {
				text : "刷新",
				iconCls : "icon-reload",
				handler : function() {
					store.load();
				}
			}, "-", range, "->", {
				xtype : "tbtext",
				id : "home-outlay-sum",
				text : "消费：<span class='statistics'>￥0.00</span>"
			} ]
		};
	}
});
