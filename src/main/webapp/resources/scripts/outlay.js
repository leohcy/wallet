Ext.define("wallet.outlay", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			border : false,
			html : "支出"
		});
		this.callParent(arguments);
	}
});
