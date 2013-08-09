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

pimcore.registerNS("pimcore.report.piwik.qrcodes");
pimcore.report.piwik.qrcodes = Class.create(pimcore.report.abstract, {

    matchType: function (type) {
			return type == "global";
    },


    getName: function () {
        return "qrcodes";
    },

    getIconCls: function () {
        return "pimcore_icon_qrcode";
    },

    getPanel: function () {
				/*
        this.loadCounter = 0;
        this.initStores();
				*/
			 
        var panel = new Ext.Panel({
            title: t("qr_codes"),
            layout: "border",
            height: 680,
            border: false,
            items: [this.getTree(), this.getEditPanel()],
						bbar:["<span>Developed by: <a href=\"http://www.weblizards.de/\" target=\"_blank\" style=\"color: #000\" title=\"Weblizards - Custom Internet Solutions\">Weblizards - Custom Internet Solutions</a></span>"]
        });
        return panel;
			 
    },

    getTree: function () {
        if (!this.tree) {
            this.tree = new Ext.tree.TreePanel({
                id: "plugin_piwik_panel_qrcode_tree",
                region: "west",
                useArrows:true,
                autoScroll:true,
                animate:true,
                containerScroll: true,
                border: true,
                width: 250,
                split: true,
                root: {
                    nodeType: 'async',
                    id: '0'
                },
                loader: new Ext.tree.TreeLoader({
                    dataUrl: '/admin/reports/qrcode/tree',
                    requestMethod: "GET",
                    baseAttrs: {
                        listeners: this.getTreeNodeListeners(),
                        reference: this,
                        allowDrop: false,
                        allowChildren: false,
                        isTarget: false,
                        iconCls: "pimcore_icon_qrcode",
                        leaf: true
                    }
                }),
                rootVisible: false
            });

            this.tree.on("render", function () {
                this.getRootNode().expand();
            });
        }

        return this.tree;
    },

    getEditPanel: function () {
        if (!this.editPanel) {
            this.editPanel = new Ext.TabPanel({
                region: "center"
            });
        }

        return this.editPanel;
    },

    activate: function () {
        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.activate("piwik_qrcode");
    },





    getTreeNodeListeners: function () {
        var treeNodeListeners = {
            'click' : this.onTreeNodeClick.bind(this)/*,
            "contextmenu": this.onTreeNodeContextmenu*/
        };

        return treeNodeListeners;
    },

    onTreeNodeClick: function (node) {
        this.openCode(node.id);
    },

    openCode: function (id) {
        Ext.Ajax.request({
            url: "/admin/reports/qrcode/get",
            params: {
                name: id
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                var fieldPanel = new pimcore.report.piwik.qrcode.item(data, this);
                pimcore.layout.refresh();
            }.bind(this)
        });
    },


    activate: function () {
        Ext.getCmp("pimcore_panel_tabs").activate("pimcore_qrcode");
    }


});

// add to report broker
pimcore.report.broker.addGroup("piwik", "piwik_web_analytics", "Piwik_report_piwik_group");
pimcore.report.broker.addReport(pimcore.report.piwik.qrcodes, "piwik");
