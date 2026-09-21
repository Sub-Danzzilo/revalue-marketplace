CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `tag` VARCHAR(30) NULL,
    `tone` VARCHAR(30) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `products` (`name`, `price`, `tag`, `tone`) VALUES
    ('Kompos Premium REVALUE', 25000, 'Popular', 'green'),
    ('Kompos Semai', 12500, 'New', 'dark'),
    ('Pupuk Cair', 18000, 'Best', 'amber'),
    ('Kompos Buah', 22000, 'Hot', 'teal');