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
