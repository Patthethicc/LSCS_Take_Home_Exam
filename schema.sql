CREATE DATABASE lscs_test;
USE lscs_test;

CREATE TABLE product(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sellerName VARCHAR(255) NOT NULL,
    rating INT UNSIGNED NOT NULL,
    CHECK (rating <= 5 AND price >= 0)
);

