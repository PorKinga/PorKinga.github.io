<?php

namespace App;

class SeparatedValuesEncoder implements EncoderInterface{
    public function supports($format)
    {
        return $format == 'csv' || $format == 'ssv' || $format == 'tsv';
    }

    public function decode($text, $format)
    {
        $separator = $this->getSeparator($format);

        $text = str_replace("\r\n", "\n", $text);
        $text = str_replace("\r", "\n", $text);

        $lines = explode("\n", trim($text)); //tekst na linie

        $headers = explode($separator, $lines[0]); //1 wiersz jako naglowek

        $data = array();

        for ($i = 1; $i < count($lines); $i++) {
            $values = explode($separator, $lines[$i]);

            $row = array();

            for ($j = 0; $j < count($headers); $j++) {
                $row[$headers[$j]] = $values[$j] ?? '';
            }

            $data[] = $row;
        }

        return $data;
    }

    public function encode($data, $format){
        $separator = $this->getSeparator($format);

        if (count($data) == 0) {
            return '';
        }

        $headers = array_keys($data[0]);

        $lines = array();

        $lines[] = implode($separator, $headers);

        foreach ($data as $row) {
            $values = array();

            foreach ($headers as $header) {
                $values[] = $row[$header] ?? '';
            }

            $lines[] = implode($separator, $values);
        }

        return implode("\n", $lines);
    }

    private function getSeparator($format){
        if ($format == 'csv') {
            return ',';
        }
        if ($format == 'ssv') {
            return ';';
        }
        if ($format == 'tsv') {
            return "\t";
        }
        return ',';
    }
}