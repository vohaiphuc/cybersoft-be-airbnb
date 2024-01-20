DROP DATABASE IF EXISTS airbnb;
CREATE DATABASE airbnb;
USE airbnb;

DROP TABLE IF EXISTS vi_tri;
CREATE TABLE vi_tri(
	id INT PRIMARY KEY AUTO_INCREMENT,
	ten_vi_tri VARCHAR(255) NOT NULL,
    hinh_anh VARCHAR(255),
    tinh_thanh VARCHAR(255) NOT NULL,
    quoc_gia VARCHAR(255) NOT NULL
);
INSERT INTO vi_tri (ten_vi_tri, hinh_anh, tinh_thanh, quoc_gia) VALUES
    ('Quận 3', 'image_quan_3.jpg', 'Hồ Chí Minh', 'Việt Nam'),
    ('Quận 1', 'image_quan_1.jpg', 'Hồ Chí Minh', 'Việt Nam'),
    ('Dĩ An', 'image_di_an.jpg', 'Bình Dương', 'Việt Nam');

-- Theo diagram thì có ban_la với ban_ui, vì 2 cái là một nên chỉ để ban_ui
DROP TABLE IF EXISTS phong;
CREATE TABLE phong(
	id INT PRIMARY KEY AUTO_INCREMENT,
	ten_phong VARCHAR(255) NOT NULL,
    khach INT NOT NULL,
    phong_ngu INT NOT NULL,
    giuong INT NOT NULL,
    phong_tam INT NOT NULL,
    mo_ta VARCHAR(255) NOT NULL,
    gia_tien DOUBLE NOT NULL,
    may_giat BOOLEAN DEFAULT false,
    ban_ui BOOLEAN DEFAULT false,
    tivi BOOLEAN DEFAULT false,
    dieu_hoa BOOLEAN DEFAULT false,
    wifi BOOLEAN DEFAULT false,
    bep BOOLEAN DEFAULT false,
    do_xe BOOLEAN DEFAULT false,
    ho_boi BOOLEAN DEFAULT false,
    hinh_anh VARCHAR(255),
    vi_tri_id INT,
    FOREIGN KEY (vi_tri_id) REFERENCES vi_tri(id)
);
-- Insert room data for Quận 3 and Quận 1 in Hồ Chí Minh (vi_tri_id=1)
INSERT INTO phong (ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_ui, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, hinh_anh, vi_tri_id) VALUES
    ('Room 1', 2, 1, 1, 1, 'Beautiful room with a view', 100, true, true, true, true, true, true, true, true, 'room1.jpg', 1),
    ('Room 2', 3, 2, 2, 1, 'Spacious family room', 150, true, true, true, true, true, true, true, true, 'room2.jpg', 1),
    ('Room 3', 1, 1, 1, 1, 'Cozy single room', 80, false, true, true, false, true, false, false, false, 'room3.jpg', 1);
-- Insert room data for Dĩ An in Bình Dương (vi_tri_id=2)
INSERT INTO phong (ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_ui, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, hinh_anh, vi_tri_id) VALUES
    ('Room 4', 2, 1, 1, 1, 'Modern room with amenities', 120, true, true, true, true, true, true, false, false, 'room4.jpg', 2),
    ('Room 5', 4, 2, 2, 2, 'Luxurious suite with a pool view', 200, true, true, true, true, true, true, true, true, 'room5.jpg', 2);

DROP TABLE IF EXISTS nguoi_dung;
CREATE TABLE nguoi_dung(
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    birth_day DATETIME NOT NULL,
    gender VARCHAR(255) NOT NULL CHECK (gender IN ('MALE', 'FEMALE')),
    role VARCHAR(255) NOT NULL CHECK (role IN ('ADMIN', 'USER'))
);
INSERT INTO nguoi_dung (name, email, password, refresh_token, phone, birth_day, gender, role) VALUES
    ('User 1', 'user1@example.com', 'password1', 'refresh_token1', '123456789', '1990-01-01', 'MALE', 'ADMIN'),
    ('User 2', 'user2@example.com', 'password2', 'refresh_token2', '987654321', '1995-05-15', 'FEMALE', 'ADMIN'),
    ('User 3', 'user3@example.com', 'password3', 'refresh_token3', '111222333', '1985-12-10', 'MALE', 'USER'),
    ('User 4', 'user4@example.com', 'password4', 'refresh_token4', '444555666', '1988-07-20', 'FEMALE', 'USER'),
    ('User 5', 'user5@example.com', 'password5', 'refresh_token5', '777888999', '1992-03-25', 'MALE', 'USER');

DROP TABLE IF EXISTS dat_phong;
CREATE TABLE dat_phong(
	id INT PRIMARY KEY AUTO_INCREMENT,
	ma_phong INT,
    ngay_den DATETIME NOT NULL,
    ngay_di DATETIME NOT NULL,
    so_luong_khach INT NOT NULL,
    ma_nguoi_dat INT,
    FOREIGN KEY (ma_phong) REFERENCES phong(id),
    FOREIGN KEY (ma_nguoi_dat) REFERENCES nguoi_dung(id)
);
INSERT INTO dat_phong (ma_phong, ngay_den, ngay_di, so_luong_khach, ma_nguoi_dat) VALUES
    (1, '2024-01-10 12:00:00', '2024-01-15 12:00:00', 2, 1),
    (3, '2024-02-05 15:00:00', '2024-02-10 10:00:00', 3, 2),
    (2, '2024-03-20 14:00:00', '2024-03-25 12:00:00', 1, 3);

DROP TABLE IF EXISTS binh_luan;
CREATE TABLE binh_luan(
	id INT PRIMARY KEY AUTO_INCREMENT,
	ma_phong INT,
    ma_nguoi_binh_luan INT,
    ngay_binh_luan DATETIME NOT NULL,
    noi_dung VARCHAR(255) NOT NULL,
    sao_binh_luan INT NOT NULL,
    FOREIGN KEY (ma_phong) REFERENCES phong(id),
    FOREIGN KEY (ma_nguoi_binh_luan) REFERENCES nguoi_dung(id)
);
INSERT INTO binh_luan (ma_phong, ma_nguoi_binh_luan, ngay_binh_luan, noi_dung, sao_binh_luan) VALUES
    (1, 1, '2024-01-15 14:30:00', 'Nice room and great service!', 5),
    (2, 2, '2024-02-10 11:45:00', 'The view from the room is amazing!', 4),
    (3, 3, '2024-03-25 10:15:00', 'Clean and comfortable. I enjoyed my stay.', 5);
