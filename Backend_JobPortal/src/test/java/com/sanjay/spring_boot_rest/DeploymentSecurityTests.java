package com.sanjay.spring_boot_rest;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.RANDOM_PORT)
class DeploymentSecurityTests {
    @LocalServerPort int port;
    final HttpClient client=HttpClient.newHttpClient();
    final String password="local-test-password-123";
    HttpResponse<String> call(String method,String path,String body,String user,boolean writeHeader,String origin) throws Exception {
        var request=HttpRequest.newBuilder(URI.create("http://127.0.0.1:"+port+path));
        if (body!=null) request.header("Content-Type","application/json");
        if (user!=null) request.header("Authorization","Basic "+Base64.getEncoder().encodeToString((user+":"+password).getBytes(StandardCharsets.UTF_8)));
        if (writeHeader) request.header("X-Requested-With","XMLHttpRequest");
        if (origin!=null) request.header("Origin",origin);
        return client.send(request.method(method,body==null?HttpRequest.BodyPublishers.noBody():HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
    }
    @Test void authenticationOwnershipValidationAndPersistence() throws Exception {
        String owner="owner_"+UUID.randomUUID().toString().substring(0,8);
        String other="other_"+UUID.randomUUID().toString().substring(0,8);
        for (String username:new String[]{owner,other}) {
            var result=call("POST","/register","{\"username\":\""+username+"\",\"password\":\""+password+"\"}",null,true,null);
            assertEquals(201,result.statusCode());
            assertFalse(result.body().contains("password"));
        }
        assertEquals(409,call("POST","/register","{\"username\":\""+owner+"\",\"password\":\""+password+"\"}",null,true,null).statusCode());
        String payload="{\"postId\":2147480000,\"ownerUsername\":\"forged\",\"postProfile\":\"Integration test\",\"postDesc\":\"Test record\",\"reqExperience\":1,\"postTechStack\":[\"Java\"]}";
        assertEquals(401,call("POST","/jobPost",payload,null,true,null).statusCode());
        assertEquals(403,call("POST","/jobPost",payload,owner,false,null).statusCode());
        var created=call("POST","/jobPost",payload,owner,true,null);
        assertEquals(200,created.statusCode(),created.body());
        var json=new tools.jackson.databind.ObjectMapper().readTree(created.body());
        int id=json.get("postId").asInt();
        assertNotEquals(2147480000,id);
        assertEquals(owner,json.get("ownerUsername").asString());
        String update=payload.replace("2147480000",Integer.toString(id));
        assertEquals(403,call("PUT","/jobPost",update,other,true,null).statusCode());
        assertEquals(403,call("DELETE","/jobPost/"+id,null,other,true,null).statusCode());
        assertEquals(400,call("PUT","/jobPost",update.replace("Integration test",""),owner,true,null).statusCode());
        assertEquals(200,call("PUT","/jobPost",update,owner,true,null).statusCode());
        assertEquals(200,call("GET","/jobPost/"+id,null,null,false,null).statusCode());
        assertEquals(403,call("GET","/load",null,owner,false,null).statusCode());
        assertEquals(200,call("DELETE","/jobPost/"+id,null,owner,true,null).statusCode());
        assertEquals(404,call("GET","/jobPost/"+id,null,null,false,null).statusCode());
    }
    @Test void healthAndCors() throws Exception {
        var health=call("GET","/actuator/health",null,null,false,null);
        assertEquals(200,health.statusCode());
        assertTrue(health.body().contains("UP"));
        assertFalse(health.body().contains("jdbc"));
        var allowed=call("GET","/jobPosts",null,null,false,"http://localhost:3000");
        assertEquals("http://localhost:3000",allowed.headers().firstValue("access-control-allow-origin").orElseThrow());
        assertEquals(403,call("GET","/jobPosts",null,null,false,"https://untrusted.example").statusCode());
        var preflight=HttpRequest.newBuilder(URI.create("http://127.0.0.1:"+port+"/jobPost"))
            .header("Origin","http://localhost:3000").header("Access-Control-Request-Method","POST")
            .header("Access-Control-Request-Headers","authorization,content-type,x-requested-with")
            .method("OPTIONS",HttpRequest.BodyPublishers.noBody()).build();
        assertEquals(200,client.send(preflight,HttpResponse.BodyHandlers.ofString()).statusCode());
    }
}
