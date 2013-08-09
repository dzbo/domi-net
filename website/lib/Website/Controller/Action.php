<?php

class Website_Controller_Action extends Pimcore_Controller_Action_Frontend {

  public function init () {

    parent::init();

    // get locale from session
    $localeSession = new Zend_Session_Namespace('locale');
    if($localeSession->language == '') {
      $localeSession->language = 'pl';
    }
        
    // locale
    $locale = new Zend_Locale($localeSession->language);
    Zend_Registry::set("Zend_Locale", $locale);
    
    // translation
    parent::initTranslation();

    $this->view->language = $locale->getLanguage();
    $this->language = $locale->getLanguage();

    //layout
    $this->enableLayout();
    $this->view->layout()->setLayout('site'); 
  }

}
