CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` varchar(500),
	`imageAlt` varchar(255),
	`status` enum('available','unavailable','sold') NOT NULL DEFAULT 'available',
	`category` varchar(100),
	`monk` varchar(255),
	`temple` varchar(255),
	`year` varchar(10),
	`material` varchar(255),
	`condition` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
