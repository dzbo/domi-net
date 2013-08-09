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
 * Puts the trackercode in the HTML
 *
 * @author Thomas Keil (thomas@weblizards.de)
 */
class Piwik_Outputfilter extends Zend_Controller_Plugin_Abstract {

		public function dispatchLoopShutdown() {
			if(!Pimcore_Tool::isHtmlResponse($this->getResponse())) {
					return;
			}
			
			if ($this->getRequest()->getParam("pimcore_editmode")) return;
			
			$config = Piwik_Tool::getSiteConfig();

			// do nothing if not configured
			if(!$config || !$config->trackid) {
					return "";
			}

			$url = Piwik_Tool::getPiwikUrl();
			
			$url = preg_replace("@^https*://@", "", $url);
			$url = rtrim($url, " /")."/";
			
			$body = $this->getResponse()->getBody();

			$code = <<<EOL
			
	<!-- Piwik --> 
	<script type="text/javascript">
		var pkBaseURL = (("https:" == document.location.protocol) ? "https://$url" : "http://$url");
		document.write(unescape("%3Cscript src='" + pkBaseURL + "piwik.js' type='text/javascript'%3E%3C/script%3E"));
	</script>
	<script type="text/javascript">
		try {
			var piwikTracker = Piwik.getTracker(pkBaseURL + "piwik.php", $config->trackid);
			piwikTracker.trackPageView();
			piwikTracker.enableLinkTracking();
		} catch( err ) {}
	</script>
	<noscript><p><img src="http://$url/piwik.php?idsite=$config->trackid" style="border:0" alt="" /></p></noscript>
	<!-- End Piwik Tracking Code -->
	

EOL;

			// search for the end <head> tag, and insert the piwik code before
			// this method is much faster than using simple_html_dom and uses less memory
			$headEndPosition = strpos($body, "</head>");
			if($headEndPosition !== false) {
					$body = substr_replace($body, $code."</head>", $headEndPosition, 7);
			}
			
			$this->getResponse()->setBody($body);

		}
	
	
}
