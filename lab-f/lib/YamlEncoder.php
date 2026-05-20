<?php

namespace App;
class YamlEncoder implements EncoderInterface{
    public function supports($format){
        return $format == 'yaml';
    }
    public function decode($text, $format) {
        return yaml_parse($text);
    }

    public function encode($data, $format){
        return yaml_emit($data);
    }
}