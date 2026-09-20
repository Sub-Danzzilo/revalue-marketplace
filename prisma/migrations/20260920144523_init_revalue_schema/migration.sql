-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('masyarakat', 'pengepul', 'industri', 'admin') NOT NULL DEFAULT 'masyarakat',
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `wallet_balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `waste_items` (
    `waste_id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_name` VARCHAR(50) NOT NULL,
    `category` ENUM('organik', 'anorganik') NOT NULL,
    `price_per_kg` DECIMAL(10, 2) NOT NULL,
    `stock_kg` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `carbon_factor_per_kg` DECIMAL(5, 2) NOT NULL,

    PRIMARY KEY (`waste_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `drop_off_locations` (
    `location_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pengepul_id` INTEGER NOT NULL,
    `location_name` VARCHAR(150) NOT NULL,
    `address` TEXT NOT NULL,
    `latitude` DECIMAL(10, 8) NOT NULL,
    `longitude` DECIMAL(11, 8) NOT NULL,

    PRIMARY KEY (`location_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `transaction_id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_code` VARCHAR(50) NOT NULL,
    `sender_id` INTEGER NOT NULL,
    `receiver_id` INTEGER NOT NULL,
    `waste_id` INTEGER NOT NULL,
    `weight_kg` DECIMAL(8, 2) NOT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('pending', 'diproses', 'penjemputan', 'selesai', 'ditolak') NOT NULL DEFAULT 'pending',
    `notification_message` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `transactions_transaction_code_key`(`transaction_code`),
    PRIMARY KEY (`transaction_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `industry_requests` (
    `request_id` INTEGER NOT NULL AUTO_INCREMENT,
    `industri_id` INTEGER NOT NULL,
    `waste_id` INTEGER NOT NULL,
    `required_weight_kg` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('pending', 'confirmed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`request_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `drop_off_locations` ADD CONSTRAINT `drop_off_locations_pengepul_id_fkey` FOREIGN KEY (`pengepul_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_waste_id_fkey` FOREIGN KEY (`waste_id`) REFERENCES `waste_items`(`waste_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `industry_requests` ADD CONSTRAINT `industry_requests_industri_id_fkey` FOREIGN KEY (`industri_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `industry_requests` ADD CONSTRAINT `industry_requests_waste_id_fkey` FOREIGN KEY (`waste_id`) REFERENCES `waste_items`(`waste_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
