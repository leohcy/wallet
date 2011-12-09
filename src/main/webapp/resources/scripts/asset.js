Ext.define("wallet.asset", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "资产统计",
			html : "资产统计"
		});
		this.callParent(arguments);
	}
});
