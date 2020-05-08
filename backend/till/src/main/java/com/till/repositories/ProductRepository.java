package com.till.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.till.entities.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

	List<Product> findAllByOrderByNameAsc();
}
