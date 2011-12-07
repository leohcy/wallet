// 首页
Ext.define("Wallet.Home", {
	extend: "Ext.panel.Panel",
	title: "首页",
	layout: { type: "hbox", align: "stretch" },
	items: [
        { flex: 1, margin: "3", html: "资产状况（雷达）" },
        { flex: 1, margin: "3 3 3 0", html: "近30日消费分布（饼）" }
	]
});

// 收支记录
Ext.define("Wallet.Records", {
	extend: "Ext.panel.Panel",
	title: "收支记录",
	html: "收支记录"
});

// 周统计
Ext.define("Wallet.WeekStats", {
	extend: "Ext.panel.Panel",
	title: "周统计",
	html: "周统计"
});

// 月统计
Ext.define("Wallet.MonthStats", {
	extend: "Ext.panel.Panel",
	title: "月统计",
	html: "月统计"
});

// 资产统计
Ext.define("Wallet.AssetsStats", {
	extend: "Ext.panel.Panel",
	title: "资产统计",
	html: "资产统计"
});

// 账户管理
Ext.define("Wallet.Account", {
	extend: "Ext.panel.Panel",
	title: "账户管理",
	html: "账户管理"
});

// 分类管理
Ext.define("Wallet.Category", {
	extend: "Ext.panel.Panel",
	title: "分类管理",
	html: "分类管理"
});

// 数据管理
Ext.define("Wallet.Database", {
	extend: "Ext.panel.Panel",
	title: "数据管理",
	html: "数据管理"
});

// 菜单
Ext.define("Wallet.Menu", {
	extend: "Ext.menu.Menu",
	initComponent: function() {
		var makeHandler = function(widget) {
			return function() {
				Ext.getCmp("tabs").addPanel(widget, this.iconCls);
			};
		};
		var menu = [ {
				title: "记 账",
				items: [
					{ text: "收&nbsp;&nbsp;入", iconCls: "icon-income" },
					{ text: "支&nbsp;&nbsp;出", iconCls: "icon-outlay" },
					{ text: "转&nbsp;&nbsp;账", iconCls: "icon-transfer" },
					{ text: "收支记录", iconCls: "icon-record", handler: makeHandler("Wallet.Records") }
				]
			}, {
				title: "统 计",
				items: [
					{ text: "周&nbsp;统&nbsp;计", iconCls: "icon-week-stats", handler: makeHandler("Wallet.WeekStats") },
					{ text: "月&nbsp;统&nbsp;计", iconCls: "icon-month-stats", handler: makeHandler("Wallet.MonthStats") },
					{ text: "资产统计", iconCls: "icon-assets-stats", handler: makeHandler("Wallet.AssetsStats") }
				]
			}, {
				title: "管 理",
				items: [
					{ text: "账户管理", iconCls: "icon-account", handler: makeHandler("Wallet.Account") },
					{ text: "分类管理", iconCls: "icon-category", handler: makeHandler("Wallet.Category") },
					{ text: "数据管理", iconCls: "icon-database", handler: makeHandler("Wallet.Database") }
				]
			}
		];
		Ext.apply(this, {
			region: "west",
			margin: "3 0 3 3",
			plain: true,
			floating: false,
			defaults: {
				xtype: "buttongroup",
				headerPosition: "left",
				margin: "3",
				columns: 1,
				defaults: {
					xtype: "button",
					scale: "large",
					margin: "3",
					cls: "menu-button",
					width: 120
				}
			},
			items: menu
		});
		this.callParent(arguments);
	}
});

// 内容区
Ext.define("Wallet.Tabs", {
	extend: "Ext.tab.Panel",
	initComponent: function() {
		Ext.apply(this, {
			region: "center",
			margin: "3",
			items: [ Ext.create("Wallet.Home") ]
		});
		this.callParent(arguments);
	},
	addPanel: function(widget, iconCls) {
		var id = widget + "-panel";
		var tab = Ext.getCmp(id);
		if(!tab) {
			tab = Ext.create(widget, { id: id, iconCls: iconCls, closable: true });
			this.add(tab);
		}
		this.setActiveTab(tab);
	}
});

// 页面布局
Ext.define("Wallet.View", {
    extend: "Ext.container.Viewport",
    initComponent: function() {
    	Ext.apply(this, {
    		layout: "border",
    		items: [
		        { region: "north", margin: "3 3 0 3", border: false, contentEl: "header" },
		        { region: "south", margin: "0 3 3 3", border: false, contentEl: "footer" },
		        Ext.create("Wallet.Menu", { id: "menu" }),
		        Ext.create("Wallet.Tabs", { id: "tabs" })
    		]
    	});
    	this.callParent(arguments);
    }
});