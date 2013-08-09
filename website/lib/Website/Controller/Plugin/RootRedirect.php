<?php 

class Website_Controller_Plugin_RootRedirect extends Zend_Controller_Plugin_Abstract
{
  /**
   * Redirects root url / to language url ie. /pl
   * 
   * (non-PHPdoc)
   * @see Zend_Controller_Plugin_Abstract::dispatchLoopStartup()
   */
  public function dispatchLoopStartup(Zend_Controller_Request_Abstract $request)
  {
    $path = $request->getPathInfo();

    if ($path == '/') {

      $localeSession = new Zend_Session_Namespace('locale');
      if($localeSession->language == '') {
        $localeSession->language = 'pl';
      }

      Zend_Controller_Action_HelperBroker::getStaticHelper('redirector')->gotoUrl('/' . $localeSession->language);
    }

  }
}

