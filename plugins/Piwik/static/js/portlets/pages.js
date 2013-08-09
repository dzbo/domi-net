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

pimcore.registerNS("pimcore.layout.portlets.piwik_pages");
pimcore.layout.portlets.piwik_pages = Class.create(pimcore.layout.portlets.abstract, {

    getType: function () {
        return "pimcore.layout.portlets.piwik_pages";
    },

    getName: function () {
        return t("piwik_pages");
    },

    getIcon: function () {
        return "Piwik_icon_pages";
    },

    getLayout: function () {
        var store = new Ext.data.JsonStore({
            autoDestroy: true,
            url: '/plugin/Piwik/metrics/portletpages',
            root: 'documents',
            fields: ['id','path',"visits"]
        });

        store.load();

        var grid = new Ext.grid.GridPanel({
            store: store,
            columns: [
                {header: t('path'), id: "path", sortable: false, dataIndex: 'path'},
                {header: t('visits'), width: 80, sortable: false, dataIndex: 'visits'}
            ],
            stripeRows: true,
            autoExpandColumn: 'path'
        });

        grid.on("rowclick", function (grid, rowIndex, event) {
            var data = grid.getStore().getAt(rowIndex);

            pimcore.helpers.openDocument(data.data.id, data.data.type);
        });

        this.layout = new Ext.ux.Portlet(Object.extend(this.getDefaultConfig(), {
            title: this.getName(),
            iconCls: this.getIcon(),
            height: 275,
            layout: "fit",
            items: [grid]
        }));

        return this.layout;
    }
});
