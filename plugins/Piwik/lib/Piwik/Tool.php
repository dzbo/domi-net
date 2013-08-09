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
 * Piwik_Tool provides some useful methods.
 *
 * @author Thomas Keil (thomas@weblizards.de)
 */
class Piwik_Tool {

	const METRIC_PAGEVIEWS = 0;
	const METRIC_UNIQUE_PAGEVIEWS = 1;
	const METRIC_EXITS = 2;
	const METRIC_ENTRANCES = 3;
	const METRIC_BOUNCES = 4;
	
	static protected $labels = array(
			self::METRIC_PAGEVIEWS => "pageviews",
			self::METRIC_UNIQUE_PAGEVIEWS => "unique_pageviews",
			self::METRIC_EXITS => "exits",
			self::METRIC_ENTRANCES => "entrances",
			self::METRIC_BOUNCES => "bounces"
	);

	public static function getLabelForMetric($metric) {
		if (!array_key_exists($metric, self::$labels)) return "";
		return self::$labels[$metric];
	}
	
	public static function getConfig () {
		return Pimcore_Config::getReportConfig()->piwik;
	}
	
	public static function getPiwikCredentials() {
		$conf = self::getConfig();
		if($conf->tokenauth && $conf->tokenauth) return array("tokenauth" => $conf->tokenauth, "url" => $conf->piwikurl); 
		return false;
	}
	
	public static function getRestClient($method, $url = null, $tokenauth = null) {
		if (is_null($url) || is_null($tokenauth)) {
			$credentials = self::getPiwikCredentials();
			if (!$credentials) return false;
			$rest = new Zend_Rest_Client($credentials["url"]);
			$rest->token_auth($credentials["tokenauth"]);
		} else {
			$rest = new Zend_Rest_Client($url);
			$rest->token_auth($tokenauth);
		}
		
		$rest->module("API");
		$rest->format("xml");
		
		$rest->method($method);
		return $rest;
	}

	public static function getSiteConfig ($site = null) {
			$siteKey = Pimcore_Tool_Frontend::getSiteKey($site);
      $config = self::getConfig();
			if($config->sites->$siteKey) {
					return $config->sites->$siteKey;
			}
			return false;
	}

	public static function getPiwikUrl() {
		return self::getConfig()->piwikurl;
	}
	
	public static function getSiteDomain($site = null) {
    $domain = $_SERVER["SERVER_NAME"]; // Good default.
		
    if(Site::isSiteRequest()) {
      $site = Site::getCurrentSite();
      $domains = $site->getDomains();
      $domain = $domains[0];
    } else {
      $config = self::getConfig();
			if($config->sites->default->siteurl) {
				$domain = $config->sites->default->siteurl;
			}
    }

		$domain = rtrim($domain, "/");
    return $domain;
	}
	

}
