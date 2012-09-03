Ext.define("wallet.month", {
	extend : "Ext.panel.Panel",

	initComponent : function() {
		Ext.apply(this, {
			title : "月统计",
			bodyStyle : "background:#DFE8F6",
			layout : "fit",
			items : [ this.initChart() ]
		});
		this.callParent(arguments);
	},

	initChart : function() {
		var fields = [], names = [];
		for ( var category in this.params) {
			fields.push("c" + this.params[category].id);
			names.push(this.params[category].name);
		}
		var store = util.store({
			fields : [ "year", "month", "total" ].concat(fields),
			url : "/statistics/latestMonthOutlay",
			load : function() {
				this.each(function(record) {
					record.set("date", record.get("year") + "年"
							+ record.get("month") + "月");
				});
			}
		});
		store.proxy.extraParams = {
			months : 18
		};
		return {
			xtype : "chart",
			margin : "0 50 0 0",
			animate : true,
			store : store,
			legend : {
				position : "top"
			},
			axes : [ {
				type : "Numeric",
				position : "left",
				fields : fields,
				grid : true,
				minimum : 0
			}, {
				type : "Category",
				position : "bottom",
				fields : "date"
			} ],
			series : [ {
				type : "column",
				xField : "date",
				yField : fields,
				title : names,
				stacked : true,
				tips : {
					trackMouse : true,
					width : 140,
					renderer : (function() {
						var tpl = new Ext.Template(
								"{0}<br/>分类：{1}<br/>消费：{2}<br/>"
										+ "比重：{3}<br/>月消费：{4}").compile();
						return function(item, attr) {
							var date = item.get("date");
							var category = names[attr.field];
							var amount = util.currency(attr.value[1]);
							var percent = util.percent(attr.value[1]
									/ item.get("total"));
							var total = util.currency(item.get("total"));
							this.setTitle(tpl.apply([ date, category, amount,
									percent, total ]));
						};
					})()
				},
				isItemInPoint : function(x, y, item, i) {
					var bbox = item.sprite.getBBox();
					var target = bbox.x <= x && bbox.y <= y
							&& (bbox.x + bbox.width) >= x
							&& (bbox.y + bbox.height) >= y;
					if (target)
						item.field = i % fields.length;
					return target;
				}
			} ]
		};
	}
});
