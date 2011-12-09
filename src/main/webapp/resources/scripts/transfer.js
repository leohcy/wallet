Ext.define("wallet.transfer", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			border : false,
			html : "转账"
		});
		this.callParent(arguments);
	}
});
