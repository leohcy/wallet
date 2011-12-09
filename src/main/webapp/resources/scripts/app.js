Ext.define("wallet.app", {
	extend : "Ext.container.Viewport",
	requires : [ "wallet.util" ],

	initComponent : function() {
		Ext.apply(this, {
			layout : "border",
			items : [ {
				region : "north",
				margin : "3 3 0 3",
				border : false,
				contentEl : "header"
			}, {
				region : "south",
				margin : "0 3 3 3",
				border : false,
				contentEl : "footer"
			}, {
				region : "center",
				margin : "3",
				xtype : "tabpanel",
				items : Ext.create("wallet.home")
			}, {
				region : "west",
				margin : "3 0 3 3",
				xtype : "menu",
				plain : true,
				floating : false,
				defaults : {
					xtype : "buttongroup",
					headerPosition : "left",
					margin : "3",
					columns : 1,
					defaults : {
						xtype : "button",
						scale : "large",
						margin : "3",
						cls : "menu-button",
						width : 120
					}
				},
				items : [ {
					title : "记 账",
					items : [ {
						text : "收&nbsp;&nbsp;入",
						iconCls : "icon-income",
						handler : this.showDialog("收入", "wallet.income")
					}, {
						text : "支&nbsp;&nbsp;出",
						iconCls : "icon-outlay",
						handler : this.showDialog("支出", "wallet.outlay")
					}, {
						text : "转&nbsp;&nbsp;账",
						iconCls : "icon-transfer",
						handler : this.showDialog("转账", "wallet.transfer")
					}, {
						text : "收支记录",
						iconCls : "icon-record",
						handler : this.menuHandler("wallet.record")
					} ]
				}, {
					title : "统 计",
					items : [ {
						text : "周&nbsp;统&nbsp;计",
						iconCls : "icon-week-stats",
						handler : this.menuHandler("wallet.week")
					}, {
						text : "月&nbsp;统&nbsp;计",
						iconCls : "icon-month-stats",
						handler : this.menuHandler("wallet.month")
					}, {
						text : "资产统计",
						iconCls : "icon-asset-stats",
						handler : this.menuHandler("wallet.asset")
					} ]
				}, {
					title : "管 理",
					items : [ {
						text : "账户管理",
						iconCls : "icon-account",
						handler : this.menuHandler("wallet.account")
					}, {
						text : "分类管理",
						iconCls : "icon-category",
						handler : this.menuHandler("wallet.category")
					}, {
						text : "数据管理",
						iconCls : "icon-database",
						handler : function() {
							window.open("/h2/", "_blank");
						}
					} ]
				} ]
			} ]
		});
		this.callParent(arguments);
	},

	menuHandler : function(widget) {
		var app = this;
		return function() {
			app.addPanel(widget, this.iconCls);
		};
	},
	addPanel : function(widget, iconCls) {
		var tabs = this.down("tabpanel");
		var id = widget + "-panel";
		var tab = Ext.getCmp(id);
		if (!tab) {
			tab = Ext.create(widget, {
				id : id,
				iconCls : iconCls,
				closable : true
			});
			tabs.add(tab);
		}
		tabs.setActiveTab(tab);
	},
	showDialog : function(title, widget) {
		return function() {
			Ext.create("Ext.window.Window", {
				title : title,
				width : 480,
				height : 320,
				modal : true,
				resizable : false,
				constrain : true,
				layout : "fit",
				items : Ext.create(widget)
			}).show();
		};
	}
});