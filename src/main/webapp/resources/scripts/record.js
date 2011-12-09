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
			fields : [ "name" ],
			data : [ [ "收入" ], [ "支出" ], [ "转账" ] ]
		});
		var store2 = util.store({
			model : "model.category",
			url : "/category/sorted",
			autoLoad : false
		});
		var store3 = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name" ],
			data : [ [ "现金" ], [ "储蓄卡" ], [ "信用卡" ], [ "充值卡" ], [ "虚拟账户" ] ]
		});
		var store4 = util.store({
			model : "model.account",
			url : "/account/sorted",
			autoLoad : false
		});
		return Ext.create("Ext.form.Panel", {
			region : "north",
			height : 108,
			margin : "5 10 0 10",
			bodyStyle : "background:#DFE8F6",
			border : false,
			id : "record-form",
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
					valueField : "name",
					displayField : "name",
					store : store1,
					name : "categoryType",
					emptyText : "请选择...",
					listeners : this.level1combo("category")
				}, {
					xtype : "combobox",
					editable : false,
					valueField : "id",
					displayField : "name",
					store : store2,
					name : "category",
					emptyText : "请选择...",
					listeners : this.level2combo("categoryType")
				} ]
			}, {
				xtype : "container",
				flex : 1,
				layout : "anchor",
				items : [ {
					fieldLabel : "账户",
					xtype : "combobox",
					editable : false,
					valueField : "name",
					displayField : "name",
					store : store3,
					name : "accountType",
					emptyText : "请选择...",
					listeners : this.level1combo("account")
				}, {
					xtype : "combobox",
					editable : false,
					valueField : "id",
					displayField : "name",
					store : store4,
					name : "account",
					emptyText : "请选择...",
					listeners : this.level2combo("accountType")
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
	level1combo : function(name) {
		return {
			select : function() {
				var form = Ext.getCmp("record-form").getForm();
				var combo = form.findField(name);
				combo.reset();
				combo.getStore().clearFilter();
			}
		};
	},
	level2combo : function(name) {
		return {
			expand : function() {
				var form = Ext.getCmp("record-form").getForm();
				var type = form.findField(name).getValue();
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
			var day = util.date(new Date(), "N");
			var monday = util.addDays(new Date(), 1 - day);
			var sunday = util.addDays(new Date(), 7 - day);
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

	initGrid : function() {
		var store = util.store({
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
		return Ext.create("Ext.grid.Panel", {
			region : "center",
			margin : "3",
			loadMask : true,
			forceFit : true,
			store : store,
			columns : [ Ext.create('Ext.grid.RowNumberer'), {
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
			})
		});
	}
});
