/**
 * Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.pimcore.org/license
 *
 * @copyright  Copyright (c) 2009-2010 elements.at New Media Solutions GmbH (http://www.elements.at)
 * @license    http://www.pimcore.org/license     New BSD License
 */

pimcore.registerNS("pimcore.report.piwik.qrcode.item");
pimcore.report.piwik.qrcode.item = Class.create(pimcore.report.qrcode.item, {

		
    addLayout: function () {
				var store = new Ext.data.JsonStore({
						autoDestroy: true,
						autoLoad: true,
						url: '/plugin/Piwik/metrics/qrcode',
						baseParams: {
								campaign: this.data.name
								//filters: "ga:campaign==" + this.data.name + ";ga:medium==QR-Code;ga:source==Mobile"
						},
						root: 'data',
						fields: ['timestamp','datetext','pageviews']
				});
			
        var panel = new Ext.Panel({
            region: "center",
            autoScroll: true,
            title: this.data.name,
            id: "plugin_piwik_qrcode_panel_" + this.data.name,
						bodyStyle: "padding:10px",
            items: [{
                xtype: "fieldset",
                title: t("general"),
                collapsible: false,
                items: [{
                    xtype: "textfield",
                    name: "name",
                    value: this.data.name,
                    fieldLabel: t("name"),
                    width: 300,
                    disabled: true
                },{
                    xtype: "textarea",
                    name: "description",
                    value: this.data.description,
                    fieldLabel: t("description"),
                    width: 300,
                    height: 50,
                    disabled: true
                },{
                    xtype: "textfield",
                    name: "url",
                    value: this.data.url,
                    fieldLabel: "URL",
                    width: 300,
                    disabled: true
                }]
							},{
								xtype: "fieldset",
                title: t("piwik_unique_pageviews"),
                collapsible: false,
                items: [{
                    xtype: 'linechart',
                    store: store,
                    height: 350,
                    xField: 'datetext',
                    series: [
                        {
                            type: 'line',
                            yField: 'pageviews',
                            style: {
                                color:0x01841c
                            }
                        }
                    ]
                }]
             }]      
        });
			
        this.parentPanel.getEditPanel().add(panel);
        this.parentPanel.getEditPanel().activate(panel);

        pimcore.layout.refresh();
			
		}
});
