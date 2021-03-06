<?php

/**
 * Author: Nikolas Schmidt-Voigt
 * Source: http://nikolassv.de/blogpost/parser-fuer-die-robots-txt-in-php/
 */


class Pimcore_Helper_RobotsTxt
{
    private $_domain = null;
    private $_rules = array();

    public function __construct($domain)
    {
        $this->_domain = $domain;
        try {
            $robotsUrl = $domain . '/robots.txt';
            $cacheKey = "robots_" . crc32($robotsUrl);

            if (!$robotsTxt = Pimcore_Model_Cache::load($cacheKey)) {
                $robotsTxt = Pimcore_Tool::getHttpData($robotsUrl);
                Pimcore_Model_Cache::save($robotsTxt, $cacheKey, array("contentanalysis", "system"), 3600, 999, true);
            }

            $this->_rules = $this->_makeRules($robotsTxt);
        } catch (Exception $e) {

        }
    }


    public function isUrlBlocked($url, $userAgent = '*')
    {
        if (!isset($this->_rules[$userAgent])) {
            $rules = isset($this->_rules['*']) ?
                $this->_rules['*'] : array();
        } else {
            $rules = $this->_rules[$userAgent];
        }

        if (count($rules) == 0) {
            return false;
        }

        $urlArray = parse_url($url);
        if (isset($urlArray['path'])) {

            $url = $urlArray['path'];

            if (isset($urlArray['query'])) {
                $url .= '?' . $urlArray['query'];
            }

            if (isset($urlArray['fragment'])) {
                $url .= '#' . $urlArray['fragment'];
            }
        }

        $blocked = false;
        $longest = 0;

        foreach ($rules as $r) {
            if (preg_match($r['path'], $url) && (strlen($r['path']) >= $longest)) {
                $longest = strlen($r['path']);
                $blocked = !($r['allow']);
            }
        }

        return $blocked;
    }

    private function _makeRules($robotsTxt)
    {
        $rules = array();
        $lines = explode("\n", $robotsTxt);

        $lines = array_filter($lines, function ($l) {
            return (preg_match('#^((dis)?allow|user-agent)[^:]*:.+#i', $l) > 0);
        });

        $userAgent = '';
        foreach ($lines as $l) {
            list($first, $second) = explode(':', $l);
            $first = trim($first);
            $second = trim($second);

            if (preg_match('#^user-agent$#i', $first)) {
                $userAgent = $second;
            } else {
                if ($userAgent) {
                    $pathRegEx = $this->_getRegExByPath($second);
                    $allow = (preg_match('#^dis#i', $first) !== 1);

                    $rules[$userAgent][] = array(
                        'path' => $pathRegEx,
                        'allow' => $allow,
                    );
                }
            }
        }

        return $rules;
    }

    private function _getRegExByPath($path)
    {
        $regEx = '';
        $path = trim($path);

        $regEx = preg_replace('#([\^+?.()])#', '\\\\$1', $path);
        $regEx = str_replace('*', '.*', $regEx);

        return '#' . $regEx . '#';
    }
}
