<?php

namespace App;
class Serializer{
    private $encoders;
    public function __construct() {
        $this->encoders = array(
            new SeparatedValuesEncoder(),
            new JsonEncoder(),
            new YamlEncoder(),
        );
    }
    public function convert($input,$inputFormat,$outputFormat){
        if ($inputFormat == $outputFormat) {
            return $input;
        }
        $data = $this->getEncoder($inputFormat)->decode($input,$inputFormat);
        return $this->getEncoder($outputFormat)->encode($data,$outputFormat);
    }

    private function getEncoder($format){
        foreach ($this->encoders as $encoder) {
            if($encoder->supports($format)){
                return $encoder;
            }
        }
        die('Blad: ' . $format);
    }
}