<?php

namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class WeatherController extends AbstractController
{
    /**
    * @Route("/weather", name="app_weather")
    */
public function weather()
    {
    return $this->render('weather/index.html.twig');
    }
}