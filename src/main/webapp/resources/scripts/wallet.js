function date(date, format) {
	if (typeof format == "undefined")
		format = "Y年m月d日";
	return Ext.util.Format.date(date, format);
}

function dateRenderer(time) {
	return date(new Date(time), "Y-m-d H:i");
}

function currency(number) {
	return Ext.util.Format.currency(number);
}

function percent(decimal) {
	return Ext.util.Format.number(decimal * 100, "0.00%");
}

function createStore(args) {
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
	if (typeof args.storeId != "undefined") {
		params.storeId = args.storeId;
	}
	if (typeof args.autoLoad != "undefined") {
		params.autoLoad = args.autoLoad;
	}
	if (typeof args.fields != "undefined") {
		params.fields = args.fields;
	} else if (typeof args.model != "undefined") {
		params.model = args.model;
	}
	if (typeof args.load != "undefined") {
		params.listeners = {
			load : args.load
		};
	}
	return Ext.create("Ext.data.Store", params);
}

function createPieChart(args) {
	var params = {
		store : args.store,
		animate : true,
		insetPadding : args.padding || 10,
		theme : args.theme || "Base",
		legend : {
			position : args.legend || "right"
		},
		series : [ {
			type : "pie",
			field : args.value,
			showInLegend : true,
			tips : {
				trackMouse : true,
				width : 120,
				renderer : args.tipsRenderer
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
	return Ext.create("Ext.chart.Chart", Ext.apply(params, args.params || {}));
}

function createRenderer(tpl, build, apply) {
	tpl = new Ext.Template(tpl).compile();
	return function(item) {
		apply.call(this, tpl.apply(build(item)));
	};
}

function objectRenderer(value) {
	if (!value)
		return "";
	var content = value.type + " | " + value.name;
	if (value.type == "收入")
		content = "<span style='color:green'>" + content + "</span>";
	else if (value.type == "支出")
		content = "<span style='color:red'>" + content + "</span>";
	else if (value.type == "转账")
		content = "<span style='color:blue'>" + content + "</span>";
	return content;
};

// 账户模型
Ext.define("model.account", {
	extend : "Ext.data.Model",
	fields : [ "id", "name", "type", "balance", "defaultIncome",
			"defaultOutlay", "display", "description", "lastUpdate",
			"createTime", "orderNo", "version" ]
});

// 分类模型
Ext.define("model.category", {
	extend : "Ext.data.Model",
	fields : [ "id", "name", "type", "total", "defaults", "checks",
			"description", "lastUpdate", "orderNo", "version" ]
});

// 收支记录模型
Ext.define("model.record", {
	extend : "Ext.data.Model",
	fields : [ "id", "occurTime", "amount", "category", "description",
			"incomeAccount", "outlayAccount", "fromAccount", "toAccount",
			"version" ]
});

// 首页
Ext.define("wallet.home", {
	extend : "Ext.panel.Panel",
	initAssetStatus : function() {
		var store = createStore({
			model : "model.account",
			url : "/account/displayed",
			load : function() {
				this.sumBalance = this.sum("balance");
				var sum = currency(this.sumBalance);
				Ext.getCmp("home-assets-sum").setText(
						"资产：<span class='statistics'>" + sum + "</span>");
			}
		});
		var grid = Ext.create("Ext.grid.Panel", {
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
				renderer : currency
			}, {
				text : "最后更新时间",
				dataIndex : "lastUpdate",
				width : 160,
				menuDisabled : true,
				renderer : dateRenderer
			} ]
		});
		var tipsRenderer = createRenderer("账户：{0}<br/>余额：{1}<br/>比重：{2}",
				function(item) {
					return [ item.get("name"), currency(item.get("balance")),
							percent(item.get("balance") / store.sumBalance) ];
				}, function(string) {
					this.setTitle(string);
				});
		var chart = Ext.create("Ext.chart.Chart", {
			flex : 3,
			store : store,
			animate : true,
			axes : [ {
				type : "Numeric",
				position : "left",
				fields : "balance",
				grid : true,
				label : {
					renderer : currency
				}
			}, {
				type : "Category",
				position : "bottom",
				fields : "name",
				label : {
					rotate : {
						degrees : 330
					}
				}
			} ],
			series : [ {
				type : "column",
				xField : "name",
				yField : "balance",
				label : {
					display : "insideEnd",
					field : "balance",
					renderer : currency,
					"text-anchor" : "middle",
					color : "#000"
				},
				tips : {
					trackMouse : true,
					width : 140,
					renderer : tipsRenderer
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
			} ]
		});
		return Ext.create("Ext.panel.Panel", {
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
		});
	},
	init30daysOutlay : function() {
		var store = createStore({
			fields : [ "name", "value" ],
			url : "/statistics/latest30DaysOutlay",
			load : function() {
				this.sumValue = this.sum("value");
				var sum = currency(this.sumValue);
				Ext.getCmp("home-outlay-sum").setText(
						"消费：<span class='statistics'>" + sum + "</span>");
			}
		});
		var tipsRenderer = createRenderer("分类：{0}<br/>金额：{1}<br/>比重：{2}",
				function(item) {
					return [ item.get("name"), currency(item.get("value")),
							percent(item.get("value") / store.sumValue) ];
				}, function(string) {
					this.setTitle(string);
				});
		var chart = createPieChart({
			store : store,
			name : "name",
			value : "value",
			tipsRenderer : tipsRenderer,
			padding : 40,
			highlight : 20
		});
		var range30days = date(Ext.Date.add(new Date(), Ext.Date.DAY, -30))
				+ " ~ " + date(new Date());
		return Ext.create("Ext.panel.Panel", {
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
			}, "-", range30days, "->", {
				xtype : "tbtext",
				id : "home-outlay-sum",
				text : "消费：<span class='statistics'>￥0.00</span>"
			} ]
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
			items : [ this.initAssetStatus(), this.init30daysOutlay() ]
		});
		this.callParent(arguments);
	}
});

// 收支记录
Ext.define("wallet.record", {
	extend : "Ext.panel.Panel",
	typeComboListener : function(id) {
		return {
			select : function() {
				var cmb = Ext.getCmp(id);
				cmb.reset();
				cmb.getStore().clearFilter();
			}
		};
	},
	comboListener : function(id) {
		return {
			expand : function() {
				var type = Ext.getCmp(id).getValue();
				if (type)
					this.getStore().filter("type", type);
				else
					this.getStore().clearFilter();
			}
		};
	},
	query : function() {
		var params = Ext.getCmp("record-form").getForm().getValues();
		if (params.startDate
				&& params.endDate
				&& Ext.Date.parse(params.startDate, "Y-m-d") > Ext.Date.parse(
						params.endDate, "Y-m-d")) {
			Ext.Msg.alert("提示", "时间范围设置不正确");
			return;
		}
		if (params.minAmount && params.maxAmount
				&& params.minAmount >= params.maxAmount) {
			Ext.Msg.alert("提示", "金额范围设置不正确");
			return;
		}
		var store = Ext.data.StoreManager.lookup("records");
		store.proxy.extraParams = params;
		store.loadPage(1);
	},
	queryWeek : function() {
		var obj = this;
		return function() {
			var today = Ext.Date.clearTime(new Date());
			var day = Ext.Date.format(today, "N");
			var monday = Ext.Date.add(today, Ext.Date.DAY, 1 - day);
			var sunday = Ext.Date.add(today, Ext.Date.DAY, 7 - day);
			var form = Ext.getCmp("record-form").getForm();
			form.findField("startDate").setValue(monday);
			form.findField("endDate").setValue(sunday);
			obj.query();
		};
	},
	queryMonth : function() {
		var obj = this;
		return function() {
			var first = Ext.Date.getFirstDateOfMonth(new Date());
			var last = Ext.Date.getLastDateOfMonth(new Date());
			var form = Ext.getCmp("record-form").getForm();
			form.findField("startDate").setValue(first);
			form.findField("endDate").setValue(last);
			obj.query();
		};
	},
	reset : function() {
		var obj = this;
		return function() {
			Ext.getCmp("record-form").getForm().reset();
			obj.query();
		};
	},
	initForm : function() {
		var categoryTypeStore = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name" ],
			data : [ [ "收入" ], [ "支出" ], [ "转账" ] ]
		});
		var categoryStore = createStore({
			model : "model.category",
			url : "/category/sorted",
			autoLoad : false
		});
		var accountTypeStore = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name" ],
			data : [ [ "现金" ], [ "储蓄卡" ], [ "信用卡" ], [ "充值卡" ], [ "虚拟账户" ] ]
		});
		var accountStore = createStore({
			model : "model.account",
			url : "/account/sorted",
			autoLoad : false
		});
		return Ext.create("Ext.form.Panel", {
			flex : 1,
			margin : "5 10 0 10",
			bodyStyle : "background:#DFE8F6",
			border : false,
			id : "record-form",
			fieldDefaults : {
				labelAlign : "top"
			},
			layout : "column",
			items : [ {
				xtype : "container",
				columnWidth : .18,
				layout : "anchor",
				items : [ {
					fieldLabel : "分类",
					id : "ctCombo",
					xtype : "combobox",
					editable : false,
					valueField : "name",
					displayField : "name",
					store : categoryTypeStore,
					anchor : "90%",
					name : "categoryType",
					emptyText : "请选择...",
					listeners : this.typeComboListener("cCombo")
				}, {
					id : "cCombo",
					xtype : "combobox",
					editable : false,
					valueField : "id",
					displayField : "name",
					store : categoryStore,
					anchor : "90%",
					name : "category",
					emptyText : "请选择...",
					listeners : this.comboListener("ctCombo")
				} ]
			}, {
				xtype : "container",
				columnWidth : .18,
				layout : "anchor",
				items : [ {
					fieldLabel : "账户",
					id : "atCombo",
					xtype : "combobox",
					editable : false,
					valueField : "name",
					displayField : "name",
					store : accountTypeStore,
					anchor : "90%",
					name : "accountType",
					emptyText : "请选择...",
					listeners : this.typeComboListener("aCombo")
				}, {
					id : "aCombo",
					xtype : "combobox",
					editable : false,
					valueField : "id",
					displayField : "name",
					store : accountStore,
					anchor : "90%",
					name : "account",
					emptyText : "请选择...",
					listeners : this.comboListener("atCombo")
				} ]
			}, {
				xtype : "container",
				columnWidth : .18,
				layout : "anchor",
				items : [ {
					fieldLabel : "日期",
					xtype : "datefield",
					format : "Y-m-d",
					anchor : "90%",
					name : "startDate",
					emptyText : "从..."
				}, {
					xtype : "datefield",
					format : "Y-m-d",
					anchor : "90%",
					name : "endDate",
					emptyText : "到..."
				} ]
			}, {
				xtype : "container",
				columnWidth : .18,
				layout : "anchor",
				items : [ {
					fieldLabel : "金额",
					xtype : "numberfield",
					minValue : 0,
					step : 10,
					anchor : "90%",
					name : "minAmount",
					emptyText : "从..."
				}, {
					xtype : "numberfield",
					minValue : 0,
					step : 10,
					anchor : "90%",
					name : "maxAmount",
					emptyText : "到..."
				} ]
			}, {
				xtype : "container",
				columnWidth : .28,
				layout : "anchor",
				items : {
					fieldLabel : "关键字",
					xtype : "textfield",
					anchor : "90%",
					name : "keyword",
					emptyText : "请输入..."
				}
			} ],
			buttons : [ {
				text : "查询",
				iconCls : "icon-query",
				handler : this.query
			}, {
				text : "本周",
				iconCls : "icon-week",
				handler : this.queryWeek()
			}, {
				text : "本月",
				iconCls : "icon-month",
				handler : this.queryMonth()
			}, {
				text : "重置",
				iconCls : "icon-reset",
				handler : this.reset()
			} ]
		});
	},
	initGrid : function() {
		var store = createStore({
			storeId : "records",
			model : "model.record",
			url : "/record/query",
			load : function() {
				var outlay = 0, income = 0, transfer = 0;
				this.each(function(record) {
					if (record.get("category").type == "支出")
						outlay += record.get("amount");
					else if (record.get("category").type == "收入")
						income += record.get("amount");
					else if (record.get("category").type == "转账")
						transfer += record.get("amount");
				});
				Ext.getCmp("record-outlay-sum").setText(
						"支出：<span class='negative'>" + currency(outlay)
								+ "</span>");
				Ext.getCmp("record-income-sum").setText(
						"收入：<span class='positive'>" + currency(income)
								+ "</span>");
				Ext.getCmp("record-transfer-sum").setText(
						"转账：<span class='statistics'>" + currency(transfer)
								+ "</span>");
			}
		});
		return Ext.create("Ext.grid.Panel", {
			flex : 4,
			margin : "3",
			loadMask : true,
			forceFit : true,
			store : store,
			columns : [ Ext.create('Ext.grid.RowNumberer'), {
				text : "发生时间",
				dataIndex : "occurTime",
				width : 120,
				menuDisabled : true,
				renderer : dateRenderer
			}, {
				text : "金额",
				dataIndex : "amount",
				width : 80,
				menuDisabled : true,
				renderer : currency
			}, {
				text : "分类",
				dataIndex : "category",
				width : 100,
				menuDisabled : true,
				renderer : objectRenderer
			}, {
				text : "描述",
				dataIndex : "description",
				width : 200,
				menuDisabled : true
			}, {
				text : "支出账户",
				dataIndex : "outlayAccount",
				width : 100,
				menuDisabled : true,
				renderer : objectRenderer
			}, {
				text : "收入账户",
				dataIndex : "incomeAccount",
				width : 100,
				menuDisabled : true,
				renderer : objectRenderer
			}, {
				text : "转出账户",
				dataIndex : "fromAccount",
				width : 100,
				menuDisabled : true,
				renderer : objectRenderer
			}, {
				text : "转入账户",
				dataIndex : "toAccount",
				width : 100,
				menuDisabled : true,
				renderer : objectRenderer
			} ],
			bbar : Ext.create("Ext.PagingToolbar", {
				store : store,
				displayInfo : true,
				items : [ "-", {
					xtype : "tbtext",
					id : "record-outlay-sum",
					text : "支出：<span class='negative'>￥0.00</span>"
				}, "-", {
					xtype : "tbtext",
					id : "record-income-sum",
					text : "收入：<span class='positive'>￥0.00</span>"
				}, "-", {
					xtype : "tbtext",
					id : "record-transfer-sum",
					text : "转账：<span class='statistics'>￥0.00</span>"
				} ]
			}),
		});
	},
	initComponent : function() {
		Ext.apply(this, {
			title : "收支记录",
			bodyStyle : "background:#DFE8F6",
			layout : {
				type : "vbox",
				align : "stretch"
			},
			items : [ this.initForm(), this.initGrid() ]
		});
		this.callParent(arguments);
	}
});

// 周统计
Ext.define("wallet.weekStats", {
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
Ext.define("wallet.monthStats", {
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
Ext.define("wallet.assetStats", {
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
Ext.define("wallet.account", {
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
Ext.define("wallet.category", {
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
Ext.define("wallet.database", {
	extend : "Ext.panel.Panel",
	initComponent : function() {
		Ext.apply(this, {
			title : "数据管理",
			html : "数据管理"
		});
		this.callParent(arguments);
	}
});

// 页面布局
Ext.define("wallet.app", {
	extend : "Ext.container.Viewport",
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
						handler : this.menuHandler("wallet.record")
					} ]
				}, {
					title : "统 计",
					items : [ {
						text : "周&nbsp;统&nbsp;计",
						iconCls : "icon-week-stats",
						handler : this.menuHandler("wallet.weekStats")
					}, {
						text : "月&nbsp;统&nbsp;计",
						iconCls : "icon-month-stats",
						handler : this.menuHandler("wallet.monthStats")
					}, {
						text : "资产统计",
						iconCls : "icon-asset-stats",
						handler : this.menuHandler("wallet.assetStats")
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
						handler : this.menuHandler("wallet.database")
					} ]
				} ]
			} ]
		});
		this.callParent(arguments);
	}
});