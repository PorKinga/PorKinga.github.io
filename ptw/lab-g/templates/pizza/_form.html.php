<?php
/** @var $pizza ?\App\Model\Pizza */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="pizza[name]" value="<?= $pizza ? $pizza->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="price">Price</label>
    <input type="text" id="price" name="pizza[price]" value="<?= $pizza ? $pizza->getPrice() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="pizza[description]"><?= $pizza? $pizza->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
