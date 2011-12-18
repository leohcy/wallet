Ext.define("wallet.category", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "分类管理",
			bodyStyle : "background:#DFE8F6",
			layout : {
				type : "hbox",
				align : "stretch"
			},
			items : [ this.initGrid(), this.initChart() ]
		});
		this.callParent(arguments);
	},

	initGrid : function() {
		var panel = this;
		var store = util.store({
			model : "model.category",
			url : "/category/sorted",
			groupField : "type",
			load : function() {
				var outlay = 0, income = 0, transfer = 0;
				var outlays = [], incomes = [], transfers = [];
				this.each(function(record, i) {
					var rec = [ record.get("name"), record.get("total") ];
					if (record.get("type") == "支出") {
						outlay += record.get("total");
						outlays.push(rec);
					} else if (record.get("type") == "收入") {
						income += record.get("total");
						incomes.push(rec);
					} else if (record.get("type") == "转账") {
						transfer += record.get("total");
						transfers.push(rec);
					}
				});
				panel.outlayStore.sumTotal = outlay;
				panel.outlayStore.loadData(outlays);
				panel.incomeStore.sumTotal = income;
				panel.incomeStore.loadData(incomes);
				panel.transferStore.sumTotal = transfer;
				panel.transferStore.loadData(transfers);
				Ext.getCmp("category-outlay-sum").setText(
						"支出：<span class='negative'>" + util.currency(outlay)
								+ "</span>");
				Ext.getCmp("category-income-sum").setText(
						"收入：<span class='positive'>" + util.currency(income)
								+ "</span>");
				Ext.getCmp("category-transfer-sum").setText(
						"转账：<span class='statistics'>"
								+ util.currency(transfer) + "</span>");
			}
		});
		this.store = store;
		this.editor = Ext.create("Ext.grid.plugin.RowEditing", {
			errorSummary : false,
			clicksToMoveEditor : 1,
			listeners : {
				validateedit : this.commit.delegate(this),
				beforeedit : function(e) {
					if (!e.record.phantom) {
						e.grid.getStore().each(function(record) {
							if (record.phantom)
								e.grid.getStore().remove(record);
						});
					}
				},
				canceledit : function(e) {
					if (e.record.phantom)
						e.store.remove(e.record);
					else if (e.record.dirty)
						e.record.reject();
				}
			}
		});
		var categoryType = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name" ],
			data : [ [ "支出" ], [ "收入" ], [ "转账" ] ]
		});
		return {
			xtype : "grid",
			flex : 3,
			margin : "3",
			loadMask : true,
			forceFit : true,
			store : this.store,
			plugins : this.editor,
			features : [ {
				ftype : "groupingsummary",
				groupHeaderTpl : "{name}"
			} ],
			columns : [ {
				xtype : "rownumberer"
			}, {
				text : "名称",
				dataIndex : "name",
				width : 100,
				menuDisabled : true,
				summaryType : "count",
				summaryRenderer : function(value) {
					return "（" + value + " 类）";
				},
				editor : {
					emptyText : "请输入...",
					allowBlank : false
				}
			}, {
				header : "类型",
				dataIndex : "type",
				width : 80,
				menuDisabled : true,
				editor : {
					xtype : "combobox",
					editable : false,
					valueField : "name",
					displayField : "name",
					store : categoryType,
					emptyText : "请选择...",
					allowBlank : false
				}
			}, {
				text : "总额",
				dataIndex : "total",
				width : 100,
				menuDisabled : true,
				renderer : util.currency,
				summaryType : "sum",
				summaryRenderer : util.currency
			}, {
				header : "备注",
				dataIndex : "description",
				width : 200,
				menuDisabled : true,
				editor : {
					allowBlank : true
				}
			}, {
				header : "最后更新时间",
				dataIndex : "lastUpdate",
				width : 120,
				menuDisabled : true,
				renderer : util.datetime,
				summaryType : "max",
				summaryRenderer : util.datetime
			}, {
				header : "默认",
				dataIndex : "defaults",
				width : 40,
				menuDisabled : true,
				renderer : util.status
			}, {
				header : "盘点",
				dataIndex : "checks",
				width : 40,
				menuDisabled : true,
				renderer : util.status
			} ],
			tbar : [ {
				text : "刷新",
				iconCls : "icon-reload",
				handler : function() {
					panel.store.load();
				}
			}, "-", {
				text : "添加账户",
				iconCls : "icon-add",
				handler : this.addCategory.delegate(this)
			}, "->", {
				xtype : "tbtext",
				id : "category-outlay-sum",
				text : "支出：<span class='negative'>￥0.00</span>"
			}, "-", {
				xtype : "tbtext",
				id : "category-income-sum",
				text : "收入：<span class='positive'>￥0.00</span>"
			}, "-", {
				xtype : "tbtext",
				id : "category-transfer-sum",
				text : "转账：<span class='statistics'>￥0.00</span>"
			} ]
		};
	},
	commit : function(panel) {
		var form = panel.editor.getEditor().getForm();
		var params = form.getValues();
		var record = panel.editor.context.record;
		if (!record.phantom)
			params.id = record.getId();
		params.version = record.get("version");
		params.total = record.get("total");
		params.lastUpdate = util.datetime(record.get("lastUpdate"));
		params.defaults = record.get("defaults");
		params.checks = record.get("checks");
		params.orderNo = record.get("orderNo");
		form.submit({
			clientValidation : false,
			url : record.phantom ? "/category/save" : "/category/update",
			params : params,
			waitTitle : "提示",
			waitMsg : "保存中...",
			success : function() {
				panel.store.load();
			},
			failure : function(form, action) {
				panel.editor.startEdit(record, 0);
				if (action.failureType != "server") {
					Ext.Msg.alert("提示", "发生错误");
				} else if (!action.result.errors) {
					Ext.Msg.alert("提示", action.result.message);
				} else {
					for ( var name in action.result.errors) {
						var field = form.findField(name);
						if (field) {
							var message = action.result.errors[name];
							field.markInvalid(message);
							var chain = field.validator;
							field.validator = function(value) {
								if (typeof (chain) == "function") {
									var msg = chain(value);
									if (msg !== true)
										return msg;
								}
								return (value != params[name]) || message;
							};
						}
					}
				}
			}
		});
	},
	addCategory : function(panel) {
		panel.editor.cancelEdit();
		var now = new Date().getTime();
		var category = Ext.create("model.category", {
			type : "支出",
			total : 0,
			lastUpdate : now,
			defaults : false,
			checks : false,
			orderNo : 0,
			version : 0
		});
		panel.store.insert(0, category);
		panel.editor.startEdit(category, 0);
	},

	initChart : function() {
		this.outlayStore = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name", "total" ]
		});
		this.incomeStore = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name", "total" ]
		});
		this.transferStore = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name", "total" ]
		});
		return {
			flex : 1,
			margin : "3 3 3 0",
			bodyStyle : "background:#DFE8F6",
			border : false,
			layout : {
				type : "vbox",
				align : "stretch"
			},
			items : [ this.createChart(this.outlayStore, "Red"),
					this.createChart(this.incomeStore, "Green"),
					this.createChart(this.transferStore, "Blue") ]
		};
	},
	createChart : function(store, theme) {
		return util.pie({
			params : {
				flex : 1
			},
			theme : theme,
			store : store,
			name : "name",
			value : "total",
			legend : false,
			tpl : "分类：{0}<br/>金额：{1}<br/>比重：{2}",
			build : function(item) {
				return [ item.get("name"), util.currency(item.get("total")),
						util.percent(item.get("total") / store.sumTotal) ];
			},
			highlight : 5
		});
	}
});
