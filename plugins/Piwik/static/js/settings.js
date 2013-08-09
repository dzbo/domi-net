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

pimcore.registerNS("pimcore.report.piwik.settings");
pimcore.report.piwik.settings = Class.create({

    initialize: function (parent) {
        this.parent = parent;
    },
		
    getKey: function () {
        return "piwik";
    },

    getLayout: function () {
       this.panel = new Ext.FormPanel({
            layout: "pimcoreform",
            title: "Piwik",
            bodyStyle: "padding: 10px;",
            autoScroll: true,
            items: [
                {
                    xtype: "textfield",
                    fieldLabel: t("piwik_url"),
                    name: "piwikurl",
                    value: this.parent.getValue("piwik.piwikurl"),
                    width: 400
                },
					
                {
                    xtype: "textfield",
                    fieldLabel: t("token_auth"),
                    name: "tokenauth",
                    value: this.parent.getValue("piwik.tokenauth"),
                    width: 400
                },
                {
                    xtype: "panel",
                    style: "padding:30px 0 0 0;",
                    border: false,
                    items: this.getConfigurations()
                }
            ],
			bbar:["<span>Developed by: <a href=\"http://www.weblizards.de/\" target=\"_blank\" style=\"color: #000\" title=\"Weblizards - Custom Internet Solutions\">Weblizards - Custom Internet Solutions</a></span>"]
        });
        return this.panel;
    },

    getConfigurations: function () {

        this.configCount = 0;
        var configs = [];
        var sites = pimcore.globalmanager.get("sites");

        // get default
        configs.push(this.getConfiguration("default", t("main_site"), "default"));

        // Set the domain of the default site if it's not set yet but set in the general settings
		Ext.Ajax.request({
            url: "/admin/settings/get-system",
            success: function (response) {
                data = Ext.decode(response.responseText);
                default_domain = Ext.util.Format.trim(data.values.general.domain);
                if (Ext.getCmp("report_settings_piwik_siteurl_default")) {
                    settings_domain = Ext.util.Format.trim(Ext.getCmp("report_settings_piwik_siteurl_default").getValue());
                    if (settings_domain == "") {
                        Ext.getCmp("report_settings_piwik_siteurl_default").setValue(default_domain);
                    }
                }
            }
        });
				
        sites.each(function (record) {
            var id = record.data.id;
            if (id) {
                var key = "site_" + id;
                var config = this.getConfiguration(key, record.data.domains.split(",").join(", "), id);
                if (config.items[2].value == "")
                    config.items[2].value = record.data.domain;
                configs.push(config);
            }

        }, this);

        return configs;
    },

    getConfiguration: function (key, name, id) {
        var config = {
            xtype: "fieldset",
            labelWidth: 300,
            title: name,
            items: [
				{
                    xtype:'combo',
                    fieldLabel: t('profile'),
                    typeAhead:true,
                    displayField: 'name',
                    store: new Ext.data.JsonStore({
                        autoDestroy: true,
                        url: "/plugin/Piwik/settings/getpiwiksites",
                        root: "data",
                        idProperty: "id",
                        fields: ["name", "id", "trackid"]
                    }),
                    listeners: {
                        "focus": function (el) {
                            var values = this.panel.getForm().getFieldValues();

                            el.getStore().reload({
                                params: {
																		piwikurl: values["piwikurl"],
                                    tokenauth: values["tokenauth"]
                                }
                            });
                        }.bind(this),
                        "select": function (id, el, record, index) {
                            Ext.getCmp("report_settings_piwik_trackid_" + id).setValue(record.data.trackid);
                        }.bind(this, id)
                    },
                    valueField: 'id',
                    width: 250,
                    forceSelection: true,
                    triggerAction: 'all',
                    hiddenName: 'profile_' + id,
                    id: "report_settings_piwik_profile_" + id,
                    value: this.parent.getValue("piwik.sites." + key + ".profile")
                },							

                {
                    xtype: "textfield",
                    fieldLabel: t("piwik_trackid"),
                    name: "trackid_" + id,
                    id: "report_settings_piwik_trackid_" + id,
                    value: this.parent.getValue("piwik.sites." + key + ".trackid")
                },{
                    xtype: "textfield",
                    fieldLabel: t("piwik_siteurl"),
										width: 300,
                    name: "siteurl_" + id,
                    id: "report_settings_piwik_siteurl_" + id,
                    value: this.parent.getValue("piwik.sites." + key + ".siteurl")
                }
            ]
        };
				
        // If the credentials are already configured try to fetch the sitename
        if ((this.parent.getValue("piwik.piwikurl") != "") && (this.parent.getValue("piwik.tokenauth") != ""))
            config.items[0].store.load();
        return config;
    },

    getValues: function () {

        var formData = this.panel.getForm().getFieldValues();

		var sites = pimcore.globalmanager.get("sites");
        var sitesData = {}; 



        sites.each(function (record) {
            var id = record.data.id;
            var key = "site_" + id;

            if(!id) { // default site
                id = "default";
                key = "default";
            }

            sitesData[key] = {
                profile: Ext.getCmp("report_settings_piwik_profile_" + id).getValue(),
                trackid: Ext.getCmp("report_settings_piwik_trackid_" + id).getValue(),
                siteurl: Ext.getCmp("report_settings_piwik_siteurl_" + id).getValue()
            };
        }, this);

        var values = {
            piwikurl: formData.piwikurl,
            tokenauth: formData.tokenauth,
            sites: sitesData
        };

        return values;
    }
});


pimcore.report.settings.broker.push("pimcore.report.piwik.settings");
