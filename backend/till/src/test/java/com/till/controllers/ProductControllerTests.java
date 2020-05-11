package com.till.controllers;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;

import com.till.controllers.params.ProductParams;
import com.till.dtos.ProductDto;
import com.till.entities.Product;
import com.till.repositories.ProductRepository;

@Sql("/sql/products.sql")
public class ProductControllerTests extends AbstractControllerTest {
	
	private static final String BASE_URL = "/products";

	@Autowired
	private ProductRepository productRepository;
	
	@Test
	@Transactional(readOnly = true)
	public void testGetAllProducts() throws Exception {
		
		String jsonResult = super.perform(get(BASE_URL))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		
		List<ProductDto> result = super.parseJsonToList(jsonResult, ProductDto.class);
		
		ProductDto product1 = result.get(0);
		assertEquals("apple", product1.getName());
		assertTrue(BigDecimal.valueOf(0.50).setScale(2).equals(product1.getPrice()));
		
		ProductDto product2 = result.get(1);
		assertEquals("banana", product2.getName());
		assertTrue(BigDecimal.valueOf(0.40).setScale(2).equals(product2.getPrice()));
	}
	
	@Test
	@Transactional
	public void testCreateProduct() throws Exception {
		ProductParams params = new ProductParams();
		params.setName("prodcutName");
		params.setPrice(BigDecimal.valueOf(5));
		
		String productId = super.performWithBody(post(BASE_URL), params)
				.andExpect(status().isCreated())
				.andReturn().getResponse().getContentAsString();
		
		List<Product> products = this.productRepository.findAllByOrderByNameAsc();
		
		assertEquals(3, products.size());
		
		Product newProduct = products.get(2);
		
		assertEquals(productId, newProduct.getId());
		assertEquals(params.getName(), newProduct.getName());
		assertTrue(params.getPrice().equals(newProduct.getPrice()));
	}
	
	@Test
	@Transactional
	public void testCreateProduct_invalidParams_throwsBadRequest() throws Exception {
		testInvalidParams(post(BASE_URL));
	}
	
	@Test
	@Transactional
	public void testUpdateProduct() throws Exception {
		
		String productId = "232860da-14a1-4fde-b404-f95d1d1bedf5";
		String url = String.format("%s/%s", BASE_URL, productId);
		
		ProductParams params = new ProductParams();
		params.setName("prodcutName");
		params.setPrice(BigDecimal.valueOf(5));
		
		super.performWithBody(put(url), params).andExpect(status().isOk());
		
		Product product = this.productRepository.findById(productId).get();

		assertEquals(params.getName(), product.getName());
		assertTrue(params.getPrice().equals(product.getPrice()));
	}
	
	@Test
	@Transactional
	public void testUpdateProduct_invalidParams_throwsBadRequest() throws Exception {
		
		String productId = "232860da-14a1-4fde-b404-f95d1d1bedf5";
		String url = String.format("%s/%s", BASE_URL, productId);
		
		testInvalidParams(put(url));
	}
	
	@Test
	@Transactional
	public void testDeleteProduct() throws Exception {
		
		String productId = "232860da-14a1-4fde-b404-f95d1d1bedf5";
		String url = String.format("%s/%s", BASE_URL, productId);
		
		super.perform(delete(url)).andExpect(status().isOk());
		
		Optional<Product> optional = this.productRepository.findById(productId);

		assertFalse(optional.isPresent());
	}
	
	private void testInvalidParams(MockHttpServletRequestBuilder requestBuilder) throws Exception {
		
		String validName = "productName";
		BigDecimal validPrice = BigDecimal.valueOf(5); 
		
		ProductParams params = new ProductParams();
		params.setName(validName);
		
		// Big price fraction
		params.setPrice(BigDecimal.valueOf(0.0000001));
		super.performWithBody(requestBuilder, params).andExpect(status().isBadRequest());
		
		// Big price integer		
		params.setPrice(BigDecimal.valueOf(100000000000L));
		super.performWithBody(requestBuilder, params).andExpect(status().isBadRequest());
		
		// Null price		
		params.setPrice(null);
		super.performWithBody(requestBuilder, params).andExpect(status().isBadRequest());
		
		// Zero price		
		params.setPrice(BigDecimal.ZERO);
		super.performWithBody(requestBuilder, params).andExpect(status().isBadRequest());
		
		// Null name
		params.setPrice(validPrice);
		params.setName(null);
		super.performWithBody(requestBuilder, params).andExpect(status().isBadRequest());
		
		// Empty name
		params.setName("");
		super.performWithBody(requestBuilder, params).andExpect(status().isBadRequest());
		
		// Too long name
		params.setName(StringUtils.repeat('1', 21));
		super.performWithBody(requestBuilder, params).andExpect(status().isBadRequest());
	}
}
