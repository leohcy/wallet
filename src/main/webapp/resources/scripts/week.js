Ext.define("wallet.week", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "周统计",
			html : "周统计"
		});
		this.callParent(arguments);
	}
});
