/**
 * Piwik Web Analytics Plugin for Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 *
 * @copyright  Copyright (c) 2012 weblizards.de  Weblizards Custom Internet Solutions GbR (http://www.weblizards.de)
 */

pimcore.registerNS("pimcore.layout.portlets.piwik_visitors");
pimcore.layout.portlets.piwik_visitors = Class.create(pimcore.layout.portlets.abstract, {

    getType: function () {
        return "pimcore.layout.portlets.piwik_visitors";
    },

    getName: function () {
        return t("piwik_visitors");
    },

    getIcon: function () {
        return "Piwik_icon_visitors";
    },

    getLayout: function () {

        var store = new Ext.data.JsonStore({
            autoDestroy: true,
            url: '/plugin/Piwik/metrics/portletvisitors',
            root: 'data',
            fields: ['timestamp','datetext',"pageviews",'visits']
        });

        store.load();


        var panel = new Ext.Panel({
            layout:'fit',
            height: 275,
            items: {
                xtype: 'linechart',
                store: store,
                xField: 'datetext',
                series: [
                    {
                        type: 'line',
                        displayName: t('pageviews'),
                        yField: 'pageviews',
                        style: {
                            color:0x01841c
                        }
                    },
                    {
                        type:'line',
                        displayName: t("visits"),
                        yField: 'visits',
                        style: {
                            color: 0x15428B
                        }
                    }
                ]
            }
        });


        this.layout = new Ext.ux.Portlet(Object.extend(this.getDefaultConfig(), {
            title: this.getName(),
            iconCls: this.getIcon(),
            height: 275,
            layout: "fit",
            items: [panel]
        }));

        return this.layout;
    }
});
