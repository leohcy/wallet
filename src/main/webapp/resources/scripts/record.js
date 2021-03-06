Ext.define("wallet.record", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "收支记录",
			bodyStyle : "background:#DFE8F6",
			layout : "border",
			items : [ this.initForm(), this.initGrid() ]
		});
		this.callParent(arguments);
	},

	initForm : function() {
		var store1 = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name", "value" ],
			data : [ [ "不限制", null ], [ "收入", "收入" ], [ "支出", "支出" ],
					[ "转账", "转账" ] ]
		});
		var store2 = util.store({
			model : "model.category",
			url : "/category/sorted",
			autoLoad : false,
			load : function() {
				this.insert(0, Ext.create("model.category", {
					name : "不限制"
				}));
			}
		});
		var store3 = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name", "value" ],
			data : [ [ "不限制", null ], [ "现金", "现金" ], [ "储蓄卡", "储蓄卡" ],
					[ "信用卡", "信用卡" ], [ "充值卡", "充值卡" ], [ "虚拟账户", "虚拟账户" ] ]
		});
		var store4 = util.store({
			model : "model.account",
			url : "/account/sorted",
			autoLoad : false,
			load : function() {
				this.insert(0, Ext.create("model.account", {
					name : "不限制"
				}));
			}
		});
		return {
			region : "north",
			height : 108,
			margin : "5 10 0 10",
			xtype : "form",
			bodyStyle : "background:#DFE8F6",
			border : false,
			fieldDefaults : {
				labelAlign : "top",
				anchor : "90%"
			},
			layout : "hbox",
			items : [ {
				xtype : "container",
				flex : 1,
				layout : "anchor",
				items : [ {
					fieldLabel : "分类",
					xtype : "combobox",
					editable : false,
					valueField : "value",
					displayField : "name",
					store : store1,
					name : "categoryType",
					emptyText : "请选择...",
					listeners : this.level1combo(this, "category")
				}, {
					xtype : "combobox",
					editable : false,
					valueField : "id",
					displayField : "name",
					store : store2,
					name : "category",
					emptyText : "请选择...",
					listeners : this.level2combo(this, "categoryType")
				} ]
			}, {
				xtype : "container",
				flex : 1,
				layout : "anchor",
				items : [ {
					fieldLabel : "账户",
					xtype : "combobox",
					editable : false,
					valueField : "value",
					displayField : "name",
					store : store3,
					name : "accountType",
					emptyText : "请选择...",
					listeners : this.level1combo(this, "account")
				}, {
					xtype : "combobox",
					editable : false,
					valueField : "id",
					displayField : "name",
					store : store4,
					name : "account",
					emptyText : "请选择...",
					listeners : this.level2combo(this, "accountType")
				} ]
			}, {
				xtype : "container",
				flex : 1,
				layout : "anchor",
				items : [ {
					fieldLabel : "日期",
					xtype : "datefield",
					format : "Y-m-d",
					name : "startDate",
					emptyText : "从..."
				}, {
					xtype : "datefield",
					format : "Y-m-d",
					name : "endDate",
					emptyText : "到..."
				} ]
			}, {
				xtype : "container",
				flex : 1,
				layout : "anchor",
				items : [ {
					fieldLabel : "金额",
					xtype : "numberfield",
					minValue : 0,
					step : 10,
					name : "minAmount",
					emptyText : "从..."
				}, {
					xtype : "numberfield",
					minValue : 0,
					step : 10,
					name : "maxAmount",
					emptyText : "到..."
				} ]
			}, {
				xtype : "container",
				flex : 2,
				layout : "anchor",
				items : {
					fieldLabel : "关键字",
					xtype : "textfield",
					name : "keyword",
					emptyText : "请输入..."
				}
			} ],
			buttons : [ {
				text : "查询",
				iconCls : "icon-query",
				handler : this.doQuery.delegate(this)
			}, {
				text : "本周",
				iconCls : "icon-week",
				handler : this.queryWeek.delegate(this)
			}, {
				text : "本月",
				iconCls : "icon-month",
				handler : this.queryMonth.delegate(this)
			}, {
				text : "重置",
				iconCls : "icon-reset",
				handler : this.reset.delegate(this)
			} ]
		};
	},
	level1combo : function(panel, name) {
		return {
			select : function() {
				var combo = panel.down("form").getForm().findField(name);
				combo.reset();
				combo.getStore().clearFilter();
			}
		};
	},
	level2combo : function(panel, name) {
		return {
			expand : function() {
				var type = panel.down("form").getForm().findField(name)
						.getValue();
				if (type) {
					this.getStore().getAt(0).set("type", type);
					this.getStore().filter("type", type);
				} else {
					this.getStore().clearFilter();
				}
			}
		};
	},
	doQuery : function(panel) {
		var params = panel.down("form").getForm().getValues();
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
		panel.store.proxy.extraParams = params;
		panel.store.loadPage(1);
	},
	queryWeek : function(panel) {
		var day = util.datef(new Date(), "N");
		var monday = util.addDays(new Date(), 1 - day);
		var sunday = util.addDays(new Date(), 7 - day);
		var form = panel.down("form").getForm();
		form.findField("startDate").setValue(monday);
		form.findField("endDate").setValue(sunday);
		panel.doQuery(panel);
	},
	queryMonth : function(panel) {
		var first = Ext.Date.getFirstDateOfMonth(new Date());
		var last = Ext.Date.getLastDateOfMonth(new Date());
		var form = panel.down("form").getForm();
		form.findField("startDate").setValue(first);
		form.findField("endDate").setValue(last);
		panel.doQuery(panel);
	},
	reset : function(panel) {
		panel.down("form").getForm().reset();
		panel.doQuery(panel);
	},

	initGrid : function() {
		this.store = util.store({
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
						"支出：<span class='negative'>" + util.currency(outlay)
								+ "</span>");
				Ext.getCmp("record-income-sum").setText(
						"收入：<span class='positive'>" + util.currency(income)
								+ "</span>");
				Ext.getCmp("record-transfer-sum").setText(
						"转账：<span class='statistics'>"
								+ util.currency(transfer) + "</span>");
			}
		});
		return {
			region : "center",
			margin : "3",
			xtype : "grid",
			loadMask : true,
			forceFit : true,
			store : this.store,
			columns : [ {
				xtype : "rownumberer"
			}, {
				text : "发生时间",
				dataIndex : "occurTime",
				width : 120,
				menuDisabled : true,
				renderer : util.datetime
			}, {
				text : "金额",
				dataIndex : "amount",
				width : 80,
				menuDisabled : true,
				renderer : util.currency
			}, {
				text : "分类",
				dataIndex : "category",
				width : 100,
				menuDisabled : true,
				renderer : util.object
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
				renderer : util.object
			}, {
				text : "收入账户",
				dataIndex : "incomeAccount",
				width : 100,
				menuDisabled : true,
				renderer : util.object
			}, {
				text : "转出账户",
				dataIndex : "fromAccount",
				width : 100,
				menuDisabled : true,
				renderer : util.object
			}, {
				text : "转入账户",
				dataIndex : "toAccount",
				width : 100,
				menuDisabled : true,
				renderer : util.object
			} ],
			bbar : {
				xtype : "pagingtoolbar",
				store : this.store,
				displayInfo : true,
				items : [ "-", {
					text : "修改",
					iconCls : "icon-update",
					id : "updateBtn",
					disabled : true,
					handler : this.update.delegate(this)
				}, "-", {
					text : "删除",
					iconCls : "icon-remove",
					id : "removeBtn",
					disabled : true,
					handler : this.remove.delegate(this)
				}, "-", {
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
			},
			listeners : {
				selectionchange : function() {
					var sm = this.getSelectionModel();
					this.down("#updateBtn").setDisabled(sm.getCount() != 1);
					this.down("#removeBtn").setDisabled(sm.getCount() != 1);
				}
			}
		};
	},
	update : function(panel) {
		var grid = panel.down("grid");
		var record = grid.getSelectionModel().getSelection()[0];
		var callback = function() {
			panel.store.load();
		};
		var o = {
			id : record.getId(),
			version : record.get("version"),
			occurTime : record.get("occurTime"),
			amount : record.get("amount"),
			category : record.get("category").id,
			description : record.get("description")
		};
		var type = record.get("category").type;
		if (type == "收入") {
			o.incomeAccount = record.get("incomeAccount").id;
			window.app.dialog("收入", "wallet.income", callback, o);
		} else if (type == "支出") {
			o.outlayAccount = record.get("outlayAccount").id;
			window.app.dialog("支出", "wallet.outlay", callback, o);
		} else if (type == "转账") {
			o.fromAccount = record.get("fromAccount").id;
			o.toAccount = record.get("toAccount").id;
			window.app.dialog("转账", "wallet.transfer", callback, o);
		}
	},
	remove : function(panel) {
		var record = panel.down("grid").getSelectionModel().getSelection()[0];
		if (!record)
			return;
		Ext.Msg.confirm("确认", "是否删除该记录", function(result) {
			if (result != "yes")
				return;
			var mask = new Ext.LoadMask(Ext.getBody(), {
				msg : "删除中..."
			});
			mask.show();
			Ext.Ajax.request({
				url : "/record/remove",
				params : {
					id : record.getId()
				},
				callback : function(opt, success, response) {
					mask.destroy();
					if (!success) {
						Ext.Msg.alert("提示", "发生错误");
					} else {
						var json = Ext.JSON.decode(response.responseText);
						if (!json.success)
							Ext.Msg.alert("提示", json.message);
						else
							panel.store.load();
					}
				}
			});
		});
	}
});
