Ext.define("wallet.account", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		this.store = util.store({
			model : "model.account",
			url : "/account/sorted",
			load : function() {
				this.sumBalance = this.sum("balance");
				var sum = util.currency(this.sumBalance);
				Ext.getCmp("account-sum").setText(
						"总资产：<span class='statistics'>" + sum + "</span>");
			}
		});
		Ext.apply(this, {
			title : "账户管理",
			bodyStyle : "background:#DFE8F6",
			layout : {
				type : "vbox",
				align : "stretch"
			},
			items : [ this.initGrid(), this.initChart() ]
		});
		this.callParent(arguments);
	},

	initGrid : function() {
		var panel = this;
		this.editor = Ext.create("Ext.grid.plugin.RowEditing", {
			errorSummary : false,
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
				}
			}
		});
		var view = {
			plugins : {
				ptype : "gridviewdragdrop"
			},
			listeners : {
				drop : function(node, data, drop, position) {
					panel.sort(data.records[0].getId(), drop.getId(),
							position == "before");
				}
			}
		};
		var accountType = Ext.create("Ext.data.ArrayStore", {
			fields : [ "name" ],
			data : [ [ "现金" ], [ "储蓄卡" ], [ "信用卡" ], [ "充值卡" ], [ "虚拟账户" ] ]
		});
		return {
			xtype : "grid",
			flex : 1,
			margin : "3",
			loadMask : true,
			forceFit : true,
			store : this.store,
			plugins : this.editor,
			viewConfig : view,
			columns : [ {
				xtype : "rownumberer"
			}, {
				text : "名称",
				dataIndex : "name",
				width : 120,
				menuDisabled : true,
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
					store : accountType,
					emptyText : "请选择...",
					allowBlank : false
				}
			}, {
				text : "余额",
				dataIndex : "balance",
				width : 120,
				menuDisabled : true,
				renderer : util.currency,
				editor : {
					xtype : "numberfield",
					emptyText : "请输入...",
					step : 10,
					allowBlank : false
				}
			}, {
				header : "备注",
				dataIndex : "description",
				width : 240,
				menuDisabled : true,
				editor : {
					allowBlank : true
				}
			}, {
				header : "最后更新时间",
				dataIndex : "lastUpdate",
				width : 120,
				menuDisabled : true,
				renderer : util.datetime
			}, {
				header : "创建时间",
				dataIndex : "createTime",
				width : 120,
				menuDisabled : true,
				renderer : util.datetime
			}, {
				header : "收入",
				dataIndex : "defaultIncome",
				width : 40,
				menuDisabled : true,
				renderer : util.status,
				editor : {
					xtype : "displayfield",
					style : "top:8px"
				}
			}, {
				header : "支出",
				dataIndex : "defaultOutlay",
				width : 40,
				menuDisabled : true,
				renderer : util.status,
				editor : {
					xtype : "displayfield",
					style : "top:8px"
				}
			}, {
				header : "显示",
				dataIndex : "display",
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
				handler : this.addAccount.delegate(this)
			}, {
				text : "删除账户",
				iconCls : "icon-remove",
				id : "removeBtn",
				disabled : true,
				handler : this.remove.delegate(this)
			}, "-", {
				text : "设为默认收入",
				iconCls : "icon-income",
				id : "incomeBtn",
				disabled : true,
				handler : this.setup.delegate(this, "/account/income")
			}, {
				text : "设为默认支出",
				iconCls : "icon-outlay",
				id : "outlayBtn",
				disabled : true,
				handler : this.setup.delegate(this, "/account/outlay")
			}, {
				text : "显示/隐藏",
				iconCls : "icon-show-hide",
				id : "displayBtn",
				disabled : true,
				handler : this.setup.delegate(this, "/account/display")
			}, "->", {
				xtype : "tbtext",
				id : "account-sum",
				text : "总资产：<span class='statistics'>￥0.00</span>"
			} ],
			listeners : {
				selectionchange : function() {
					var sm = this.getSelectionModel();
					var multi = sm.getCount() != 1;
					var sl = sm.getSelection();
					this.down("#incomeBtn").setDisabled(
							multi || sl[0].get("defaultIncome"));
					this.down("#outlayBtn").setDisabled(
							multi || sl[0].get("defaultOutlay"));
					this.down("#displayBtn").setDisabled(multi);
					this.down("#removeBtn").setDisabled(multi);
				}
			}
		};
	},
	commit : function(panel) {
		var form = panel.editor.getEditor().getForm();
		var params = form.getValues();
		var record = panel.editor.context.record;
		if (!record.phantom)
			params.id = record.getId();
		params.version = record.get("version");
		params.lastUpdate = util.datetime(record.get("lastUpdate"));
		params.createTime = util.datetime(record.get("createTime"));
		params.defaultIncome = record.get("defaultIncome");
		params.defaultOutlay = record.get("defaultOutlay");
		params.display = record.get("display");
		params.orderNo = record.get("orderNo");
		form.submit({
			clientValidation : false,
			url : record.phantom ? "/account/save" : "/account/update",
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
	sort : function(source, target, before) {
		var panel = this;
		var mask = new Ext.LoadMask(Ext.getBody(), {
			msg : "设置中..."
		});
		mask.show();
		Ext.Ajax.request({
			url : "/account/sort",
			params : {
				source : source,
				target : target,
				before : before
			},
			callback : function(opt, success, response) {
				mask.destroy();
				if (success) {
					var json = Ext.JSON.decode(response.responseText);
					if (json.success)
						panel.store.load();
					else
						Ext.Msg.alert("提示", json.message);
				} else {
					Ext.Msg.alert("提示", "发生错误");
				}
			}
		});
	},
	addAccount : function(panel) {
		panel.editor.cancelEdit();
		var now = new Date().getTime();
		var account = Ext.create("model.account", {
			lastUpdate : now,
			createTime : now,
			defaultIncome : false,
			defaultOutlay : false,
			display : true,
			orderNo : 0,
			version : 0
		});
		panel.store.insert(0, account);
		panel.editor.startEdit(account, 0);
	},
	setup : function(panel, url) {
		panel.editor.cancelEdit();
		var mask = new Ext.LoadMask(Ext.getBody(), {
			msg : "设置中..."
		});
		mask.show();
		var grid = panel.down("grid");
		var record = grid.getSelectionModel().getSelection()[0];
		Ext.Ajax.request({
			url : url,
			params : {
				id : record.getId()
			},
			callback : function(opt, success, response) {
				mask.destroy();
				if (success) {
					var json = Ext.JSON.decode(response.responseText);
					if (json.success)
						panel.store.load();
					else
						Ext.Msg.alert("提示", json.message);
				} else {
					Ext.Msg.alert("提示", "发生错误");
				}
			}
		});
	},
	remove : function(panel) {
		panel.editor.cancelEdit();
		var record = panel.down("grid").getSelectionModel().getSelection()[0];
		if (!record)
			return;
		Ext.Msg.confirm("确认", "是否删除该账户", function(result) {
			if (result != "yes")
				return;
			var mask = new Ext.LoadMask(Ext.getBody(), {
				msg : "删除中..."
			});
			mask.show();
			Ext.Ajax.request({
				url : "/account/remove",
				params : {
					id : record.getId()
				},
				callback : function(opt, success, response) {
					mask.destroy();
					if (success) {
						var json = Ext.JSON.decode(response.responseText);
						if (json.success)
							panel.store.load();
						else
							Ext.Msg.alert("提示", json.message);
					} else {
						Ext.Msg.alert("提示", "发生错误");
					}
				}
			});
		});
	},

	initChart : function() {
		var store = this.store;
		return util.column({
			params : {
				flex : 1,
				margin : "0 3 3 3"
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
				if (balance < 200)
					color = "rgb(146, 6, 157)";
				else if (balance < 800)
					color = "rgb(213, 70, 121)";
				else if (balance < 2000)
					color = "rgb(249, 153, 0)";
				else if (balance < 8000)
					color = "rgb(49, 149, 0)";
				return Ext.apply(attr, {
					fill : color
				});
			}
		});
	}
});
