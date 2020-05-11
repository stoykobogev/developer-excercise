package com.till.controllers;

import java.util.List;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.till.TillApplication;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { TillApplication.class })
@WebAppConfiguration
public abstract class AbstractControllerTest extends AbstractTransactionalJUnit4SpringContextTests {

	@Autowired
	private WebApplicationContext wac;
	
	@Autowired
	private ObjectMapper objectMapper;
	
	private MockMvc mockMvc;
	
	
	@Before
	public void init() throws Exception {
	    this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
	}

	protected <T> T parseJsonToObject(String json, Class<T> clazz) throws JsonMappingException, JsonProcessingException {
		T object = this.objectMapper.readValue(json, clazz);
		
		return object;
	}
	
	protected <T> List<T> parseJsonToList(String json, Class<T> clazz) throws JsonMappingException, JsonProcessingException {
		List<T> list = this.objectMapper.readValue(json, this.objectMapper.getTypeFactory().constructCollectionType(List.class, clazz));
		
		return list;
	}
	
	protected String parseObjectToJson(Object object) throws JsonProcessingException {
		return this.objectMapper.writeValueAsString(object);
	}
	
	protected ResultActions perform(MockHttpServletRequestBuilder requestBuilder) throws Exception {
		return this.mockMvc.perform(requestBuilder);
	}
	
	protected ResultActions performWithBody(MockHttpServletRequestBuilder requestBuilder, Object object) throws Exception {
		return this.mockMvc.perform(requestBuilder.content(parseObjectToJson(object)).contentType(MediaType.APPLICATION_JSON));
	}
}
