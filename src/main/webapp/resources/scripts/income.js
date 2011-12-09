Ext.define("wallet.income", {
	extend : "Ext.form.Panel",

	initComponent : function() {
		var form = this;
		var categoryStore = util.store({
			model : "model.category",
			url : "/category/income",
			load : function() {
				var idx = this.findExact("defaults", true);
				if (idx != -1) {
					var model = this.getAt(idx);
					form.getForm().findField("category.id").select(model);
				}
			}
		});
		var accountStore = util.store({
			model : "model.account",
			url : "/account/sorted",
			load : function() {
				var idx = this.findExact("defaultIncome", true);
				if (idx != -1) {
					var model = this.getAt(idx);
					form.getForm().findField("incomeAccount.id").select(model);
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
				name : "incomeAccount.id",
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
	},
	confirm : function() {
		var panel = this;
		return function() {
			var form = panel.getForm();
			if (form.isValid()) {
				var params = form.getValues();
				params.occurTime = params.date + " " + params.time + ":00";
				form.submit({
					clientValidation : false,
					url : "/record/income",
					params : params,
					waitTitle : "提示",
					waitMsg : "保存中...",
					success : function(form, action) {
						panel.close()();
					},
					failure : function(form, action) {
						if (!action.result.errors)
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
