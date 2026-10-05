<?php
spl_autoload_register(function ($class){
    // Map \App\ namespace to lib/ directory
    $prefix = 'App\\';
    $baseDir = __DIR__.'/lib/';

    if (0 === strpos($class, $prefix)) {
        // Remove namespace prefix and convert to file path
        $relative = substr($class, strlen($prefix));
        $file = $baseDir.str_replace('\\', '/', $relative).'.php';

        if (file_exists($file)) {
            require $file;
        }
    }
});

$input = $_COOKIE['input'] ?? '';
$inputFormat = $_COOKIE['input_format'] ?? 'csv';
$outputFormat = $_COOKIE['output_format'] ?? 'ssv';
$output = $_COOKIE['output'] ?? '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = $_POST['input'] ?? '';
    $inputFormat = $_POST['input_format'] ?? 'csv';
    $outputFormat = $_POST['output_format'] ?? 'ssv';

    $serializer = new App\Serializer();
    $output = $serializer->convert($input, $inputFormat, $outputFormat);

    setcookie('input', $input, time() + 3600);
    setcookie('input_format', $inputFormat, time() + 3600);
    setcookie('output_format', $outputFormat, time() + 3600);
    setcookie('output', $output, time() + 3600);
}

?>
<!doctype html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Kinga Poranczyk 57919</title>
</head>
<body>

<h1>Konwerter CSV/SSV/TSV/JSON/YAML</h1>
<form method="POST">
    <label>Dane wejsciowe:</label>
    <br>
    <textarea name="input" id="input" cols="30" rows="10"><?php echo $input; ?></textarea>
    <br>
    <label>Format wejsciowy:</label>
    <select name="input_format">
        <option value="csv" <?php if ($inputFormat == 'csv') echo 'selected'; ?>>CSV</option>
        <option value="ssv" <?php if ($inputFormat == 'ssv') echo 'selected'; ?>>SSV</option>
        <option value="tsv" <?php if ($inputFormat == 'tsv') echo 'selected'; ?>>TSV</option>
        <option value="json" <?php if ($inputFormat == 'json') echo 'selected'; ?>>JSON</option>
        <option value="yaml" <?php if ($inputFormat == 'yaml') echo 'selected'; ?>>YAML</option>
    </select>
    <br>
    <label>Format wyjsciowy:</label>
    <select name="output_format">
        <option value="csv" <?php if ($outputFormat == 'csv') echo 'selected'; ?>>CSV</option>
        <option value="ssv" <?php if ($outputFormat == 'ssv') echo 'selected'; ?>>SSV</option>
        <option value="tsv" <?php if ($outputFormat == 'tsv') echo 'selected'; ?>>TSV</option>
        <option value="json" <?php if ($outputFormat == 'json') echo 'selected'; ?>>JSON</option>
        <option value="yaml" <?php if ($outputFormat == 'yaml') echo 'selected'; ?>>YAML</option>
    </select>
    <br>
    <button type="submit">KONWERTUJ</button>
</form>
    <h2>WYNIK:</h2>
    <pre><?php echo $output;?></pre>
</body>
</html>