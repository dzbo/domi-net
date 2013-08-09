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
 */


/**
 * The SettingsController handles the plugin's settings.
 *
 * @author Thomas Keil (thomas@weblizards.de)
 */
class Piwik_SettingsController extends Pimcore_Controller_Action_Admin_Reports {
    

	public function getpiwiksitesAction() {
		
		$data = false;
		try {
			$rest = Piwik_Tool::getRestClient("SitesManager.getSitesWithAtLeastViewAccess", $this->_getParam("piwikurl"), $this->_getParam("tokenauth"));
		} catch (Zend_Uri_Exception $e) {
			$this->_helper->json(false);
		}
		if ($rest) {
			$data = array(
					"data" => array()
			);

			$result = $rest->get();
			
			foreach ($result->row as $row) {
				$data["data"][] = array(
						"name" => (string) $row->name,
						"id" => (string) $row->idsite, 
						"trackid" => (string) $row->idsite
				);
			}
		}
		$this->_helper->json($data);
	}	
	
	
}
