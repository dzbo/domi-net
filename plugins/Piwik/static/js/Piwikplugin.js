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
pimcore.registerNS("pimcore.plugin.Piwik");

pimcore.plugin.Piwik = Class.create(pimcore.plugin.admin, {


    getClassName: function () {
        return "pimcore.plugin.Piwik";
    },

    initialize: function() {
        pimcore.plugin.broker.registerPlugin(this);
    },


    uninstall: function() {
    
    },

    pimcoreReady: function (params, broker){
        this.getLanguages();
    },

    getLanguages: function(){
        Ext.Ajax.request({
            url: '/admin/settings/get-available-languages',
            scope:this,
            success: function (response) {
                var resp = Ext.util.JSON.decode(response.responseText);
                pimcore.globalmanager.add("Piwik.languages",resp);
            }
        });
    }



});

new pimcore.plugin.Piwik();
