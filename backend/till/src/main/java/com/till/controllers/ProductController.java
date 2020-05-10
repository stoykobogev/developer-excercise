package com.till.controllers;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import com.till.constants.AppConstants;
import com.till.controllers.params.ProductParams;
import com.till.dtos.ProductDto;
import com.till.services.ProductService;

@RestController
@RequestMapping("/products")
public class ProductController {
	
	@Autowired
	private ProductService productService;

	
	@GetMapping
	public List<ProductDto> getAllProducts() {
		return this.productService.getAllProducts();
	}
	
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public String createProduct(@Valid @RequestBody ProductParams params) {
		return this.productService.createProduct(params);
	}
	
	@PutMapping("/{productId}")
	public void updateProduct(@Valid @RequestBody ProductParams params, @Valid @Pattern(regexp = AppConstants.UUID_PATTERN) String productId) {
		this.productService.updateProduct(params, productId);
	}
	
	@DeleteMapping("/{productId}")
	public void deleteProduct(@Valid @Pattern(regexp = AppConstants.UUID_PATTERN) String productId) {
		this.productService.deleteProduct(productId);
	}
}
