<?php // I:\ptw\lab-f\yaml.php

$data = [
    'name' => 'Kinga Poranczyk',
    'index' => '57919',
    'date' => date(DATE_ATOM),
];

$yaml = yaml_emit($data);

echo $yaml;