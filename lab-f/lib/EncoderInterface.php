<?php
namespace App;
interface EncoderInterface{
    public function supports($format); #sprawdzanie obslugiwania formatu
    public function decode($text,$format); #zamiana tekstu  na tablica php
    public function encode($data, $format); #zamiana na tekst w wybranym formacie
}