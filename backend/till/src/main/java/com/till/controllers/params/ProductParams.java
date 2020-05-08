package com.till.controllers.params;

import java.math.BigDecimal;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductParams {

	@NotNull
	@Size(min = 1, max = 20)
	private String name;
	
	@NotNull
	@DecimalMin(value = "0.01")
	@Digits(integer = 7, fraction = 2)
    private BigDecimal price;
}
