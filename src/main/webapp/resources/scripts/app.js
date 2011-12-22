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
						scale : "medium",
						margin : "6",
						cls : "menu-button",
						width : 120
					}
				},
				items : [ {
					title : "记 账",
					items : [ {
						text : "收&nbsp;&nbsp;入",
						iconCls : "icon-income",
						handler : this.dialog.delegate("收入", "wallet.income")
					}, {
						text : "支&nbsp;&nbsp;出",
						iconCls : "icon-outlay",
						handler : this.dialog.delegate("支出", "wallet.outlay")
					}, {
						text : "转&nbsp;&nbsp;账",
						iconCls : "icon-transfer",
						handler : this.dialog.delegate("转账", "wallet.transfer")
					}, {
						text : "收支记录",
						iconCls : "icon-record",
						handler : this.tabs.delegate(this, "wallet.record")
					} ]
				}, {
					title : "统 计",
					items : [ {
						text : "周&nbsp;统&nbsp;计",
						iconCls : "icon-week-stats",
						handler : this.prefetch.delegate(this)
					}, {
						text : "月&nbsp;统&nbsp;计",
						iconCls : "icon-month-stats",
						handler : this.tabs.delegate(this, "wallet.month")
					}, {
						text : "资产统计",
						iconCls : "icon-asset-stats",
						handler : this.tabs.delegate(this, "wallet.asset")
					} ]
				}, {
					title : "管 理",
					items : [ {
						text : "账户管理",
						iconCls : "icon-account",
						handler : this.tabs.delegate(this, "wallet.account")
					}, {
						text : "分类管理",
						iconCls : "icon-category",
						handler : this.tabs.delegate(this, "wallet.category")
					}, {
						text : "数据管理",
						iconCls : "icon-database",
						menuAlign : "tl-tr?",
						menu : {
							plain : true,
							items : [ {
								text : "控制台",
								iconCls : "icon-console",
								handler : function() {
									window.open("/h2/");
								}
							}, {
								text : "脚本下载",
								iconCls : "icon-script",
								handler : function() {
									window.open("/database/dbscript");
								}
							}, {
								text : "数据下载",
								iconCls : "icon-download",
								handler : function() {
									window.open("/database/backup");
								}
							} ]
						}
					} ]
				} ]
			} ]
		});
		this.callParent(arguments);
	},

	tabs : function(app, widget, params) {
		var tabs = app.down("tabpanel");
		var id = widget + "-panel";
		var tab = Ext.getCmp(id);
		if (!tab) {
			tab = Ext.create(widget, {
				id : id,
				iconCls : this.iconCls,
				closable : true,
				params : params || null
			});
			tabs.add(tab);
		}
		tabs.setActiveTab(tab);
	},
	dialog : function(title, widget, callback, params) {
		Ext.create("Ext.window.Window", {
			title : title,
			width : 480,
			height : 320,
			modal : true,
			resizable : false,
			constrain : true,
			layout : "fit",
			items : Ext.create(widget, {
				params : params || null
			}),
			listeners : {
				destroy : callback || Ext.emptyFn
			}
		}).show();
	},
	prefetch : function(app) {
		var button = this;
		var mask = new Ext.LoadMask(Ext.getBody(), {
			msg : "加载中..."
		});
		mask.show();
		Ext.Ajax.request({
			url : "/category/outlay",
			callback : function(opt, success, response) {
				mask.destroy();
				if (!success) {
					Ext.Msg.alert("提示", "发生错误");
				} else {
					var json = Ext.JSON.decode(response.responseText);
					if (!json.success)
						Ext.Msg.alert("提示", json.message);
					else
						app.tabs.call(button, app, "wallet.week", json.data);
				}
			}
		});
	}
});
