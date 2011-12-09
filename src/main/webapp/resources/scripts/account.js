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
