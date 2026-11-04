package com.sanjay.spring_boot_rest.model;
import jakarta.persistence.*;
import lombok.Data;
@Data @Entity @Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="user_ids")
    @SequenceGenerator(name="user_ids", sequenceName="users_seq", allocationSize=1)
    private Integer id;
    @Column(nullable=false,unique=true,length=40)
    private String username;
    @Column(nullable=false)
    private String password;
}
