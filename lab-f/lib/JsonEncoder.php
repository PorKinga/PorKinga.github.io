<?php

namespace App;

class JsonEncoder implements EncoderInterface{
    public function supports($format){
        return $format == 'json';
    }

    public function decode($text, $format){
        return json_decode($text,true);
    }

    public function encode($data, $format){
        return json_encode($data,JSON_PRETTY_PRINT);
    }
}