Ext.define("wallet.month", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "月统计",
			html : "月统计"
		});
		this.callParent(arguments);
	}
});
