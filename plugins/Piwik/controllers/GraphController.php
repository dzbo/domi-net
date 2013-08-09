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
 * The GraphController produces graph- and chart-images
 *
 * @author Thomas Keil (thomas@weblizards.de)
 */
class Piwik_GraphController extends Pimcore_Controller_Action {
  
	
	public function init() {
		$this->getResponse()->setHeader("Content-Type", "image/png", true);
	}
	
	public function widgetAction () {
		$values = explode(",",$this->_getParam("data"));
		$width = 150;
		$height = 40;
		$this->drawGraph($width, $height, $values);
	}
	
	private function drawGraph($width, $height, $values) {
		$max = max($values);
		$factor = $max != 0 ? $height / $max : 0; // prevent division by zero
		$step = $width / sizeof($values);
		
		if (class_exists("Imagick")) {
			$colorOrange = new ImagickPixel("rgb(255,153,0)");
			$colorWhite = new ImagickPixel("#ffffff");
			
			$image = new Imagick();
			$image->newImage($width, $height, $colorWhite);
			$image->setImageFormat("png");
			$draw = new ImagickDraw();
			$draw->setStrokeColor($colorOrange);
			$draw->setStrokeLineCap(Imagick::LINEJOIN_ROUND);
			$draw->setStrokeWidth(1.5);
			for ($i=0; $i<sizeof($values)-1; $i++){
				$x1 = intval($i*$step);
				$y1 = intval($height - 1 - $values[$i]*$factor);
				$x2 = intval(($i+1)*$step);
				$y2 = intval($height - 1 - $values[$i+1]*$factor);

				$draw->line($x1, $y1, $x2, $y2);
			}
			$image->drawImage($draw);
			print $image;
		} else {
			$image=imagecreatetruecolor($width, $height);
			$colorOrange=imagecolorallocate($image, 255, 153, 0);
			$colorWhite=imagecolorallocate($image, 255, 255, 255);

			imagefill($image, 0, 0, $colorWhite);

			for ($i=0; $i<sizeof($values)-1; $i++){
				$x1 = intval($i*$step);
				$y1 = intval($height - 1 - $values[$i]*$factor);
				$x2 = intval(($i+1)*$step);
				$y2 = intval($height - 1 - $values[$i+1]*$factor);

				imageline($image, $x1, $y1, $x2, $y2, $colorOrange);
			}

			imagepng($image);
			imagedestroy($image);
		}
	}
	
}
