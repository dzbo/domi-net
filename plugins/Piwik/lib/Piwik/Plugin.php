<?php
/**
 * Piwik Web Analytics Plugin for Pimcore
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 *
 * @copyright  Copyright (c) 2012 weblizards.de  Weblizards Custom Internet Solutions GbR (http://www.weblizards.de)
 * @author Thomas Keil (thomas@weblizards.de)
 */


class Piwik_Plugin extends Pimcore_API_Plugin_Abstract implements Pimcore_API_Plugin_Interface {

    public static function needsReloadAfterInstall() {
      return true; // Adds Entry to Settings Menu
    }
		
    public static function install() {
			$config = new Zend_Config_Xml(PIMCORE_PLUGINS_PATH . "/Piwik/config.xml", null, true); // Filname, section, allowModifications
			$db = Pimcore_API_Plugin_Abstract::getDb();
			try {
				$db->insert("users_permission_definitions", array(
						"key" => $config->userPermissionObjectTreeKey,
				));
			} catch (Exception $e) {
				return "Error installing the User Permission: ".$e->getMessage().$e->getCode();
			}
			
			
			
			if (self::isInstalled()) {
					return "Piwik Plugin successfully installed.";
			} else {
					return "Piwik Plugin could not be installed";
			}
    }

    public static function uninstall() {
			$config = new Zend_Config_Xml(PIMCORE_PLUGINS_PATH . "/Piwik/config.xml", null, true); // Filname, section, allowModifications

			try {
				$db = Pimcore_API_Plugin_Abstract::getDb();
				$db->query("DELETE FROM users_permission_definitions WHERE ".$db->quoteIdentifier("key")." = ".$db->quote($config->userPermissionObjectTreeKey));
			} catch (Exception $e) {
				return "Error uninstalling the User Permission: ".$e->getMessage();
			}
			
			if (!self::isInstalled()) {
					return "Piwik Plugin successfully uninstalled.";
			} else {
					return "Piwik Plugin could not be uninstalled";
			}
    }

    public static function isInstalled() {
			$db = Pimcore_API_Plugin_Abstract::getDb();
			$config = new Zend_Config_Xml(PIMCORE_PLUGINS_PATH . "/Piwik/config.xml", null, true); // Filname, section, allowModifications
			try {
				$query = $db->select()->from("users_permission_definitions", "count(*)")->where($db->quoteIdentifier("key")." = ".$db->quote($config->userPermissionObjectTreeKey));
				$numrows = $db->fetchOne($query);
			} catch (Exception $e) {
				return "Error querying User Permission: ".$e->getMessage().$e->getCode();
			}
			
			return $numrows > 0;
    }

    public function preDispatch() {
			if (!Pimcore_Tool::isFrontend()) return;

			$front = Zend_Controller_Front::getInstance();
			$front->registerPlugin(new Piwik_Outputfilter(), 750);
    }

    /**
     *
     * @param string $language
     * @return string path to the translation file relative to plugin direcory
     */
    public static function getTranslationFile($language) {
        if(file_exists(PIMCORE_PLUGINS_PATH . "/Piwik/texts/" . $language . ".csv")){
            return "/Piwik/texts/" . $language . ".csv";
        }
        return "/Piwik/texts/de.csv";
        
    }

}