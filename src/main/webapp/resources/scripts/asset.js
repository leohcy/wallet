Ext.define("wallet.asset", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "资产统计",
			bodyStyle : "background:#DFE8F6",
			layout : "fit",
			items : [ this.initChart() ]
		});
		this.callParent(arguments);
	},

	initChart : function() {
		var store = util.store({
			fields : [ "year", "month", "income", "outlay", "balance" ],
			url : "/statistics/latestMonth",
			load : function() {
				this.each(function(record) {
					record.set("date", record.get("year") + "年"
							+ record.get("month") + "月");
				});
			}
		});
		store.proxy.extraParams = {
			months : 12
		};
		var tips = {
			width : 150,
			renderer : util.renderer("{0}<br/>本月消费：{1}<br/>"
					+ "本月收入：{2}<br/>月末资产：{3}", function(item) {
				return [ item.get("date"), util.currency(item.get("outlay")),
						util.currency(item.get("income")),
						util.currency(item.get("balance")) ];
			}, function(string) {
				this.setTitle(string);
			})
		};
		return {
			xtype : "chart",
			margin : "0 75 0 0",
			animate : true,
			store : store,
			legend : {
				position : "top"
			},
			axes : [ {
				type : "Numeric",
				position : "left",
				fields : [ "income", "outlay", "balance" ],
				grid : true,
				minimum : 0,
				grid : {
					odd : {
						opacity : 1,
						fill : "#ccc"
					}
				}
			}, {
				type : "Category",
				position : "bottom",
				fields : "date"
			} ],
			series : [ {
				type : "line",
				style : {
					fill : "#D54679",
					stroke : "#D54679"
				},
				markerConfig : {
					type : "circle",
					size : 4,
					radius : 4,
					fill : "#A61120",
					stroke : "#A61120"
				},
				highlight : {
					size : 7,
					radius : 7
				},
				tips : tips,
				xField : "date",
				yField : "outlay",
				title : "消费"
			}, {
				type : "line",
				style : {
					fill : "#A7BD3A",
					stroke : "#A7BD3A"
				},
				markerConfig : {
					type : "circle",
					size : 4,
					radius : 4,
					fill : "#319500",
					stroke : "#319500"
				},
				highlight : {
					size : 7,
					radius : 7
				},
				tips : tips,
				xField : "date",
				yField : "income",
				title : "收入"
			}, {
				type : "line",
				smooth : true,
				fill : true,
				style : {
					fill : "#38B8BF",
					stroke : "#38B8BF"
				},
				markerConfig : {
					type : "cross",
					size : 4,
					radius : 4,
					fill : "#18428E",
					stroke : "#18428E"
				},
				highlight : {
					size : 7,
					radius : 7
				},
				tips : tips,
				xField : "date",
				yField : "balance",
				title : "资产余额"
			} ]
		};
	}
});
