function date(date, format) {
	if (typeof format == "undefined")
		format = "Y年m月d日";
	return Ext.util.Format.date(date, format);
}

function currency(number) {
	return Ext.util.Format.currency(number);
}

function percent(decimal) {
	return Ext.util.Format.number(decimal * 100, "0.00%");
}

// 首页
Ext.define("Wallet.Home", {
	extend : "Ext.panel.Panel",
	init30daysOutlay : function() {
		var afterLoad = function() {
			store.sumValue = store.sum("value");
			var sum = Ext.get("home-outlay-sum").dom;
			sum.innerText = currency(store.sumValue);
		};
		var store = Ext.create("Ext.data.Store", {
			fields : [ "name", "value" ],
			proxy : {
				type : "ajax",
				url : "/statistics/latest30DaysOutlay",
				reader : {
					root : "data"
				}
			},
			autoLoad : true,
			listeners : {
				load : afterLoad
			}
		});
		var reload = function() {
			store.load();
		};
		var chartTipsTpl = new Ext.Template("分类：{0}<br/>金额：{1}<br/>比重：{2}")
				.compile();
		var chartTipsRenderer = function(item) {
			this.setTitle(chartTipsTpl.apply([ item.get("name"),
					currency(item.get("value")),
					percent(item.get("value") / store.sumValue) ]));
		};
		var chart = Ext.create("Ext.chart.Chart", {
			store : store,
			animate : true,
			insetPadding : 40,
			legend : {
				position : "right"
			},
			series : [ {
				type : "pie",
				field : "value",
				showInLegend : true,
				tips : {
					trackMouse : true,
					width : 120,
					renderer : chartTipsRenderer
				},
				highlight : {
					segment : {
						margin : 20
					}
				},
				label : {
					field : "name",
					display : "rotate",
					contrast : true
				}
			} ]
		});
		var range30days = date(Ext.Date.add(new Date(), Ext.Date.DAY, -30))
				+ " ~ " + date(new Date());
		var sum30days = "消费：<span id='home-outlay-sum'>￥0.00</span>"
				+ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		return Ext.create("Ext.panel.Panel", {
			flex : 1,
			margin : "3 3 3 0",
			title : "近30日消费分布",
			layout : "fit",
			items : [ chart ],
			bbar : [ {
				iconCls : "icon-reload",
				handler : reload
			}, "-", range30days, "->", sum30days ]
		});
	},
	initComponent : function() {
		Ext.apply(this, {
			title : "首页",
			bodyStyle : "background:#DFE8F6",
			layout : {
				type : "hbox",
				align : "stretch"
			},
			items : [ {
				flex : 1,
				margin : "3",
				html : "资产状况（雷达）"
			}, this.init30daysOutlay() ]
		});
		this.callParent(arguments);
	}
});

// 收支记录
Ext.define("Wallet.Records", {
	extend : "Ext.panel.Panel",
	initComponent : function() {
		Ext.apply(this, {
			title : "收支记录",
			html : "收支记录"
		});
		this.callParent(arguments);
	}
});

// 周统计
Ext.define("Wallet.WeekStats", {
	extend : "Ext.panel.Panel",
	initComponent : function() {
		Ext.apply(this, {
			title : "周统计",
			html : "周统计"
		});
		this.callParent(arguments);
	}
});

// 月统计
Ext.define("Wallet.MonthStats", {
	extend : "Ext.panel.Panel",
	initComponent : function() {
		Ext.apply(this, {
			title : "月统计",
			html : "月统计"
		});
		this.callParent(arguments);
	}
});

// 资产统计
Ext.define("Wallet.AssetsStats", {
	extend : "Ext.panel.Panel",
	initComponent : function() {
		Ext.apply(this, {
			title : "资产统计",
			html : "资产统计"
		});
		this.callParent(arguments);
	}
});

// 账户管理
Ext.define("Wallet.Account", {
	extend : "Ext.panel.Panel",
	initComponent : function() {
		Ext.apply(this, {
			title : "账户管理",
			html : "账户管理"
		});
		this.callParent(arguments);
	}
});

// 分类管理
Ext.define("Wallet.Category", {
	extend : "Ext.panel.Panel",
	initComponent : function() {
		Ext.apply(this, {
			title : "分类管理",
			html : "分类管理"
		});
		this.callParent(arguments);
	}
});

// 数据管理
Ext.define("Wallet.Database", {
	extend : "Ext.panel.Panel",
	initComponent : function() {
		Ext.apply(this, {
			title : "数据管理",
			html : "数据管理"
		});
		this.callParent(arguments);
	}
});

// 菜单
Ext.define("Wallet.Menu", {
	extend : "Ext.menu.Menu",
	initComponent : function() {
		var makeHandler = function(widget) {
			return function() {
				Ext.getCmp("tabs").addPanel(widget, this.iconCls);
			};
		};
		Ext.apply(this, {
			region : "west",
			margin : "3 0 3 3",
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
					iconCls : "icon-income"
				}, {
					text : "支&nbsp;&nbsp;出",
					iconCls : "icon-outlay"
				}, {
					text : "转&nbsp;&nbsp;账",
					iconCls : "icon-transfer"
				}, {
					text : "收支记录",
					iconCls : "icon-record",
					handler : makeHandler("Wallet.Records")
				} ]
			}, {
				title : "统 计",
				items : [ {
					text : "周&nbsp;统&nbsp;计",
					iconCls : "icon-week-stats",
					handler : makeHandler("Wallet.WeekStats")
				}, {
					text : "月&nbsp;统&nbsp;计",
					iconCls : "icon-month-stats",
					handler : makeHandler("Wallet.MonthStats")
				}, {
					text : "资产统计",
					iconCls : "icon-assets-stats",
					handler : makeHandler("Wallet.AssetsStats")
				} ]
			}, {
				title : "管 理",
				items : [ {
					text : "账户管理",
					iconCls : "icon-account",
					handler : makeHandler("Wallet.Account")
				}, {
					text : "分类管理",
					iconCls : "icon-category",
					handler : makeHandler("Wallet.Category")
				}, {
					text : "数据管理",
					iconCls : "icon-database",
					handler : makeHandler("Wallet.Database")
				} ]
			} ]
		});
		this.callParent(arguments);
	}
});

// 内容区
Ext.define("Wallet.Tabs", {
	extend : "Ext.tab.Panel",
	initComponent : function() {
		Ext.apply(this, {
			region : "center",
			margin : "3",
			items : [ Ext.create("Wallet.Home") ]
		});
		this.callParent(arguments);
	},
	addPanel : function(widget, iconCls) {
		var id = widget + "-panel";
		var tab = Ext.getCmp(id);
		if (!tab) {
			tab = Ext.create(widget, {
				id : id,
				iconCls : iconCls,
				closable : true
			});
			this.add(tab);
		}
		this.setActiveTab(tab);
	}
});

// 页面布局
Ext.define("Wallet.View", {
	extend : "Ext.container.Viewport",
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
			}, Ext.create("Wallet.Menu"), Ext.create("Wallet.Tabs", {
				id : "tabs"
			}) ]
		});
		this.callParent(arguments);
	}
});