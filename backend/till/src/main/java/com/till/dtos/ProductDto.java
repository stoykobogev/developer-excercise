package com.till.dtos;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductDto {

	private String id;
	private String name;
	private BigDecimal price;
}
