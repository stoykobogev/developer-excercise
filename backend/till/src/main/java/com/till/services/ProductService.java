package com.till.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.till.controllers.params.ProductParams;
import com.till.dtos.ProductDto;
import com.till.entities.Product;
import com.till.exceptions.NoSuchEntityException;
import com.till.repositories.ProductRepository;

@Service
public class ProductService {

	@Autowired
	private ModelMapper modelMapper;
	
	@Autowired
	private ProductRepository productRepository;
	
	
	@Transactional(readOnly = true)
	public List<ProductDto> getAllProducts() {
		
		List<Product> products = this.productRepository.findAllByOrderByNameAsc();
		List<ProductDto> dtos = products.stream()
				.map(product -> this.modelMapper.map(product, ProductDto.class))
				.collect(Collectors.toList());
		
		return dtos;
	}
	
	@Transactional
	public String createProduct(ProductParams params) {
		
		Product product = new Product();
		product.setName(params.getName());
		product.setPrice(params.getPrice());
		
		this.productRepository.save(product);
		
		return product.getId();
	}
	
	@Transactional
	public void updateProduct(ProductParams params, String productId) {
		
		Product product = this.productRepository.findById(productId)
				.orElseThrow(() -> new NoSuchEntityException(Product.class, productId));
		
		product.setName(params.getName());
		product.setPrice(params.getPrice());
	}
	
	@Transactional
	public void deleteProduct(String productId) {
		
		Product product = this.productRepository.findById(productId)
				.orElseThrow(() -> new NoSuchEntityException(Product.class, productId));
		
		this.productRepository.delete(product);
	}
}







