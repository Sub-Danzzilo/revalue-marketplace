ALTER TABLE `waste_items`
    MODIFY `category` ENUM('organik', 'anorganik', 'b3') NOT NULL,
    ADD COLUMN `medical_type` ENUM('sekali_pakai', 'dapat_digunakan_kembali') NULL;

INSERT INTO `waste_items`
    (`type_name`, `category`, `medical_type`, `price_per_kg`, `stock_kg`, `carbon_factor_per_kg`)
VALUES
    ('Masker dan sarung tangan medis', 'b3', 'sekali_pakai', 0.00, 0.00, 0.00),
    ('Alat medis non-infeksius', 'b3', 'dapat_digunakan_kembali', 0.00, 0.00, 0.00);