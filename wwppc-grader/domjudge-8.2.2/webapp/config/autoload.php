<?php declare(strict_types=1);
/**
 * Generated from 'autoload.php.in' on Sun Feb 25 05:58:46 PM EST 2024.
 *
 * Autoload setup file for the Symfony application
 *
 * Part of the DOMjudge Programming Contest Jury System and licensed
 * under the GNU GPL. See README and COPYING for details.
 */

use Doctrine\Common\Annotations\AnnotationRegistry;
use Composer\Autoload\ClassLoader;

// Load the static domserver file if we don't have the constants from it yet
if (!defined('LIBVENDORDIR')) {
    require('/home/a25ra0631/domjudge/domserver/etc/domserver-static.php');
}

return require LIBVENDORDIR.'/autoload.php';
