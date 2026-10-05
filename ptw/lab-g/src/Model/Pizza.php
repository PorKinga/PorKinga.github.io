<?php
namespace App\Model;

use App\Service\Config;

class Pizza
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $description= null;
    private ?string $price = null;
    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Pizza
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Pizza
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Pizza
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(?string $price): Pizza
    {
        $this->price = $price;

        return $this;
    }

    public static function fromArray($array): Pizza
    {
        $pizza = new self();
        $pizza->fill($array);

        return $pizza;
    }

    public function fill($array): Pizza
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        if (isset($array['price'])) {
            $this->setPrice($array['price']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM pizza';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $pizzas = [];
        $pizzasArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($pizzasArray as $pizzaArray) {
            $pizzas[] = self::fromArray($pizzaArray);
        }

        return $pizzas;
    }

    public static function find($id): ?Pizza
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM pizza WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $pizzaArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $pizzaArray) {
            return null;
        }
        $pizza = Pizza::fromArray($pizzaArray);

        return $pizza;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO pizza (name, price,description) VALUES (:name,:price, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'price' => $this->getPrice(),
                'description' => $this->getDescription(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE pizza SET name = :name, price = :price, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':price' => $this->getPrice(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM pizza WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setName(null);
        $this->setPrice(null);
        $this->setDescription(null);
    }
}
