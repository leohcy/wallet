Ext.define("wallet.outlay", {
	extend : "Ext.form.Panel",

	initComponent : function() {
		var form = this;
		var categoryStore = util.store({
			model : "model.category",
			url : "/category/outlay",
			load : function() {
				if (form.params) {
					form.getForm().findField("category.id").select(
							form.params.category);
				} else {
					var idx = this.findExact("defaults", true);
					if (idx != -1) {
						var model = this.getAt(idx);
						form.getForm().findField("category.id").select(model);
					}
				}
			}
		});
		var accountStore = util.store({
			model : "model.account",
			url : "/account/sorted",
			load : function() {
				if (form.params) {
					form.getForm().findField("outlayAccount.id").select(
							form.params.outlayAccount);
				} else {
					var idx = this.findExact("defaultOutlay", true);
					if (idx != -1) {
						var model = this.getAt(idx);
						form.getForm().findField("outlayAccount.id").select(
								model);
					}
				}
			}
		});
		Ext.apply(this, {
			border : false,
			margin : "20",
			bodyStyle : "background:#DFE8F6",
			fieldDefaults : {
				anchor : "100%",
				allowBlank : false
			},
			items : [ {
				xtype : "container",
				layout : "hbox",
				items : [ {
					fieldLabel : "时间",
					flex : 2,
					xtype : "datefield",
					format : "Y-m-d",
					value : new Date(),
					name : "date",
					emptyText : "请选择..."
				}, {
					flex : 1,
					xtype : "timefield",
					format : "H:i",
					value : new Date(),
					name : "time",
					emptyText : "请选择..."
				} ]
			}, {
				fieldLabel : "金额",
				xtype : "numberfield",
				name : "amount",
				emptyText : "请输入...",
				minValue : 0,
				step : 10
			}, {
				fieldLabel : "分类",
				xtype : "combobox",
				store : categoryStore,
				valueField : "id",
				displayField : "name",
				name : "category.id",
				emptyText : "请选择...",
				queryMode : "local",
				editable : false
			}, {
				fieldLabel : "账户",
				xtype : "combobox",
				store : accountStore,
				valueField : "id",
				displayField : "name",
				name : "outlayAccount.id",
				emptyText : "请选择...",
				queryMode : "local",
				editable : false
			}, {
				fieldLabel : "描述",
				xtype : "textfield",
				name : "description",
				allowBlank : true
			} ],
			buttons : [ {
				text : "确认",
				iconCls : "icon-confirm",
				scale : "medium",
				handler : this.confirm()
			}, {
				text : "取消",
				iconCls : "icon-cancel",
				scale : "medium",
				handler : this.close()
			} ]
		});
		this.callParent(arguments);
		this.initUpdateParams();
	},
	initUpdateParams : function() {
		if (!this.params)
			return;
		var occurTime = new Date(this.params.occurTime);
		this.getForm().findField("date").setValue(occurTime);
		this.getForm().findField("time").setValue(occurTime);
		this.getForm().findField("amount").setValue(this.params.amount);
		this.getForm().findField("description").setValue(
				this.params.description);
	},
	confirm : function() {
		var panel = this;
		return function() {
			var form = panel.getForm();
			if (form.isValid()) {
				var url = "/record/save/outlay";
				var params = form.getValues();
				params.occurTime = params.date + " " + params.time + ":00";
				if (panel.params) {
					url = "/record/update/outlay";
					params.id = panel.params.id;
					params.version = panel.params.version;
				}
				form.submit({
					clientValidation : false,
					url : url,
					params : params,
					waitTitle : "提示",
					waitMsg : "保存中...",
					success : function(form, action) {
						panel.close()();
					},
					failure : function(form, action) {
						if (action.failureType != "server")
							Ext.Msg.alert("提示", "发生错误");
						else if (!action.result.errors)
							Ext.Msg.alert("提示", action.result.message);
					}
				});
			}
		};
	},
	close : function() {
		var panel = this;
		return function() {
			panel.ownerCt.close();
		};
	}
});
