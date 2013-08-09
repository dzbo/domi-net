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
 * The MetricsController gets the fata from Piwik's API and
 * processes it suitable for output with ExtJS
 *
 * @author Thomas Keil (thomas@weblizards.de)
 */
class Piwik_MetricsController extends Pimcore_Controller_Action_Admin_Reports {
    
	public $metrics = array();
	public $metrics_tokens = array();
	public $t = null;
	
	public function init() {
		parent::init();
		$this->metrics = array(
				Piwik_Tool::METRIC_PAGEVIEWS => array("method" => "VisitsSummary.getVisits", "process" => "processSingleResult"),
				Piwik_Tool::METRIC_UNIQUE_PAGEVIEWS => array("method" => "VisitsSummary.getUniqueVisitors", "process" => "processSingleResult"),
				Piwik_Tool::METRIC_EXITS => array("method" => "Actions.getExitPageUrls", "process" => "processRowResult", "value" => "nb_visits"),
				Piwik_Tool::METRIC_ENTRANCES => array("method" => "Actions.getEntryPageUrls", "process" => "processRowResult", "value" => "nb_visits"),
				Piwik_Tool::METRIC_BOUNCES => array("method" => "VisitsSummary.getBounceCount", "process" => "processSingleResult")
		);
		
		$this->metrics_tokens = array(
				"pageviews"        => Piwik_Tool::METRIC_PAGEVIEWS,
				"unique_pageviews" => Piwik_Tool::METRIC_UNIQUE_PAGEVIEWS,
				"exits"            => Piwik_Tool::METRIC_ENTRANCES,
				"entrances"        => Piwik_Tool::METRIC_ENTRANCES,
				"bounces"          => Piwik_Tool::METRIC_BOUNCES
		);		
	}
	
	public function portletvisitorsAction () {
		$outputData = false;
    $siteKey = $this->_getParam("siteKey");
    if (!$siteKey) {
      $config = Piwik_Tool::getConfig();
      $siteKey = $config->sites->default->trackid;
    }
		
		try {
			$rest = Piwik_Tool::getRestClient("VisitsSummary.get");
				} catch (Zend_Uri_Exception $e) {
			$this->_helper->json(false);
		}
		
		$rest->idSite($siteKey);
		if ($rest) {
			$outputData = array();
			$rest->period("day");
			$rest->date("last30");
			
			$response = $rest->get();

      if ($response->error["message"]) {
        die(__CLASS__.", Line ".__LINE__.": Zend_Rest_Client Error: ".$response->error["message"]);
      }

			foreach ($response->results as $result) {
				$date = new Zend_Date(strtotime($result["date"]));
				$tmpData = array(
						"timestamp" => $date->getTimestamp(),
						"datetext"  => $date->get(Zend_Date::DATE_MEDIUM),
						"visits"    => $result->nb_visits  ? (string) $result->nb_visits : "0",
						"pageviews" => $result->nb_actions ? (string) $result->nb_actions : "0"
				);
				$outputData[] = $tmpData;
			}
		}
		$this->_helper->json(array("data" => $outputData));
	}

	public function portletpagesAction () {
		$outputData = false;
    $siteKey = $this->_getParam("siteKey");
    if (!$siteKey) {
      $config = Piwik_Tool::getConfig();
      $siteKey = $config->sites->default->trackid;
    }
		
		try {
			$rest = Piwik_Tool::getRestClient("Actions.getPageUrls");
	  } catch (Zend_Uri_Exception $e) {
			$this->_helper->json(false);
		}

    if (!$rest) {
      var_dump($rest);
    }
		
		$rest->idSite($siteKey);
		if ($rest) {
			$outputData = array();
			$rest->period("month");
			$rest->date("2012-07-22");
			
			$response = $rest->get();

      if ($response->error["message"]) {
        die(__CLASS__.", Line ".__LINE__.": Zend_Rest_Client Error: ".$response->error["message"]);
      }

			$id = 0;
			foreach ($response->result->row as $result) {
				$tmpData = array(
						"id" => $id,
						"visits"    => $result->nb_visits  ? (string) $result->nb_visits : "0",
						"path" => (string) $result->label
				);
				$id++;
				$outputData[] = $tmpData;
			}
			
			$outputData = array_slice($outputData, 0, 10);
		}
		$this->_helper->json(array("documents" => $outputData));
	}
	
	
	public function qrcodeAction() {
		$startDate = date("Y-m-d",(time()-(86400*31)));
		$endDate = date("Y-m-d");
		$campaign = $this->_getParam("campaign");
		
		if ($this->_getParam("dateFrom") && $this->_getParam("dateTo")) {
			$startDate = date("Y-m-d",strtotime($this->_getParam("dateFrom")));
			$endDate = date("Y-m-d",strtotime($this->_getParam("dateTo"))); 
		}
		$period = $startDate.",".$endDate;
		
    $segment = $this->processSegment();

    $siteKey = $this->_getParam("siteKey");
    if (!$siteKey) {
      $config = Piwik_Tool::getConfig();
      $siteKey = $config->sites->default->trackid;
    }
		
		$rest = Piwik_Tool::getRestClient("Referers.getCampaigns");
		$rest->period("day");
		$rest->date($period);
		$rest->idSite($siteKey);
		if ($segment) $rest->segment($segment);

		$response = $rest->get();

    if ($response->error["message"]) {
      die(__CLASS__.", Line ".__LINE__.": Zend_Rest_Client Error: ".$response->error["message"]);
    }

		foreach ($response->results as $result) {
			$date = new Zend_Date(strtotime($result["date"]));

			$tmpData = array(
					"timestamp" => $date->getTimestamp(),
					"datetext" => $date->get(Zend_Date::DATE_MEDIUM),
			);
			$value = "0";
			foreach ($result->row as $row) {
				if ($row->label == $campaign) {
					$nb_uniq_visitors = $row->nb_uniq_visitors;
					(string) $value = $nb_uniq_visitors ? (string) $nb_uniq_visitors : "0";
				}
			}
			$tmpData["pageviews"] = $value;
			$data[] = $tmpData;
		}
		
		$this->_helper->json(array("data" => $data));
	}
	
	public function summaryAction () {
		$startDate = date("Y-m-d",(time()-(86400*31)));
		$endDate = date("Y-m-d");

		if ($this->_getParam("dateFrom") && $this->_getParam("dateTo")) {
			$startDate = date("Y-m-d",strtotime($this->_getParam("dateFrom")));
			$endDate = date("Y-m-d",strtotime($this->_getParam("dateTo"))); 
		}
		$period = $startDate.",".$endDate;
		
    $segment = $this->processSegment();
    
    $siteKey = $this->_getParam("siteKey");
    if (!$siteKey) {
      $config = Piwik_Tool::getConfig();
      $siteKey = $config->sites->default->trackid;
    }
		
		
		$data = array();
		$dailyDataGrouped = array();

		
		foreach ($this->metrics as $key => $metric) {
      $rest = Piwik_Tool::getRestClient($metric["method"]);
      $rest->period("day");
      $rest->date($period);
      $rest->idSite($siteKey);
      if ($segment) $rest->segment($segment);
      try {
        $response = $rest->get();
      } catch (Zend_Rest_Client_Result_Exception $e) {
        var_dump($e);
        die();
      }
      
      if ($response->error["message"]) {
        die(__CLASS__.", Line ".__LINE__.": Zend_Rest_Client Error: ".$response->error["message"]);
      }
      
			foreach ($response->results as $result) {
				$processed_data = $this->$metric["process"]($result, $metric["value"]);
				$dailyDataGrouped[$key][] = (int) $processed_data["value"];
				$data[$key] += (int) $processed_data["value"];
			}
		}
		
		$outputData = array();
		foreach ($data as $metric => $value) {
			$outputData[$metric] = array(
				"label" => "piwik_".Piwik_Tool::getLabelForMetric($metric),
				"value" => round($value,2),
				"chart" => "/plugin/Piwik/graph/widget/data/" . implode(",",$dailyDataGrouped[$metric]),
				"metric" => Piwik_Tool::getLabelForMetric($metric)
			);
		}

		ksort($outputData);

		$this->_helper->json(array("data" => $outputData));
	}
	
	public function chartmetricdataAction() {
		$startDate = date("Y-m-d",(time()-(86400*31)));
		$endDate = date("Y-m-d");

		if ($this->_getParam("dateFrom") && $this->_getParam("dateTo")) {
			$startDate = date("Y-m-d",strtotime($this->_getParam("dateFrom")));
			$endDate = date("Y-m-d",strtotime($this->_getParam("dateTo"))); 
		}
		$period = $startDate.",".$endDate;
		
    $segment = $this->processSegment();

    $siteKey = $this->_getParam("siteKey");
    if (!$siteKey) {
      $config = Piwik_Tool::getConfig();
      $siteKey = $config->sites->default->trackid;
    }
		
		
		$token = "pageviews";
		if($this->_getParam("metric")) {
			$token = $this->_getParam("metric");
		}
		$metric = $this->getMetricForParamToken($token);
		
		$data = array();
		$rest = Piwik_Tool::getRestClient($metric["method"]);
		$rest->period("day");
		$rest->date($period);
		$rest->idSite($siteKey);
		if ($segment) $rest->segment($segment);

		$response = $rest->get();

    if ($response->error["message"]) {
      die(__CLASS__.", Line ".__LINE__.": Zend_Rest_Client Error: ".$response->error["message"]);
    }

		foreach ($response->results as $result) {
			$processed_data = $this->$metric["process"]($result, $metric["value"]);
			
			$tmpData = array(
					"timestamp" => $processed_data["timestamp"],
					"datetext" => $processed_data["datetext"],
			);
			
			if($this->_getParam("dataField")) {
				$tmpData[$this->_getParam("dataField")] = (int) $processed_data["value"];
			} else {
				$tmpData[$token] = (int) $processed_data["value"];
			}
			
			$data[] = $tmpData;
		}
		$this->_helper->json(array("data" => $data));
	}

  public function sourceAction() {
		$startDate = date("Y-m-d",(time()-(86400*31)));
		$endDate = date("Y-m-d");

		if ($this->_getParam("dateFrom") && $this->_getParam("dateTo")) {
			$startDate = date("Y-m-d",strtotime($this->_getParam("dateFrom")));
			$endDate = date("Y-m-d",strtotime($this->_getParam("dateTo"))); 
		}
		$period = $startDate.",".$endDate;
		
    $segment = $this->processSegment();

    $siteKey = $this->_getParam("siteKey");
    if (!$siteKey) {
      $config = Piwik_Tool::getConfig();
      $siteKey = $config->sites->default->trackid;
    }
		
		$data = array();
		$rest = Piwik_Tool::getRestClient("Referers.getRefererType");
		$rest->period("range");
		$rest->date($period);
		$rest->idSite($siteKey);
		if ($segment) $rest->segment($segment);

		$response = $rest->get();

    if ($response->error["message"]) {
      die(__CLASS__.", Line ".__LINE__.": Zend_Rest_Client Error: ".$response->error["message"]);
    }

		foreach ($response->result as $row) {
			$data[] = array(
					"pageviews" => (int) $row->nb_visits,
					"source" => (string) $this->view->translate($row->label)
			);
		}
		$this->_helper->json(array("data" => $data));
  }

  /**
	 *
	 * @param $result SimpleXMLElement
	 * @return array
	 */
	protected function processSingleResult($result, $value = null) {
		$date = new Zend_Date(strtotime($result["date"]));
		
		$tmpData = array(
				"timestamp" => $date->getTimestamp(),
				"datetext" => $date->get(Zend_Date::DATE_MEDIUM),
				"value" => (string) $result ? (string) $result : "0"
		);
		return $tmpData;
	}
	
	protected function processRowResult($result, $value = null) {
		$date = new Zend_Date(strtotime($result["date"]));
		
		$tmpData = array(
				"timestamp" => $date->getTimestamp(),
				"datetext" => $date->get(Zend_Date::DATE_MEDIUM),
				"value" => (string) $result->row->$value ? (string) $result->row->$value : "0"
		);
		return $tmpData;

	}

	protected function getMetricForParamToken($token) {
		// TODO: check if the token is valid
		return $this->metrics[$this->metrics_tokens[$token]];
	}

  protected function processSegment() {
		$segment = false;
    $segment_path = $this->_getParam("path");
		if($segment_path) {
      if ($segment_path == "/") {
        $segment =   "pageUrl==http://".Piwik_Tool::getSiteDomain()."/,pageUrl==http://".Piwik_Tool::getSiteDomain()."/index.php";
				$segment .= ",pageUrl==https://".Piwik_Tool::getSiteDomain()."/,pageUrl==https://".Piwik_Tool::getSiteDomain()."/index.php";
      } else {
        $segment = "pageUrl==http://".Piwik_Tool::getSiteDomain().$segment_path.",pageUrl==https://".Piwik_Tool::getSiteDomain().$segment_path;
      }
			
		}
    return $segment;
  }
}