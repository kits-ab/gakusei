//package se.kits.gakusei;
//
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
//import org.springframework.orm.jpa.JpaTransactionManager;
//import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
//import org.springframework.transaction.PlatformTransactionManager;
//import org.springframework.transaction.annotation.EnableTransactionManagement;
//
//import javax.persistence.EntityManagerFactory;
//import javax.sql.DataSource;
//
//@Configuration
//@EnableTransactionManagement
//@EnableJpaRepositories(
//        entityManagerFactoryRef = "entityManagerFactory",
//        transactionManagerRef = "userTransactionManager",
//        basePackages = {"se.kits.gakusei.user.repository"}
//)
//public class UserConfig {
//
//    @Primary
//    @Bean(name = "userDataSource")
//    @ConfigurationProperties(prefix = "spring.datasource")
//    public DataSource userDatasource(){
//        return DataSourceBuilder.create().build();
//    }
//
//    @Primary
//    @Bean(name = "entityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
//            EntityManagerFactoryBuilder builder,
//            @Qualifier("userDataSource") DataSource dataSource){
//        return builder.dataSource(dataSource)
//                .packages("se.kits.gakusei.user.model")
//                .persistenceUnit("user")
//                .build();
//    }
//
//    @Primary
//    @Bean(name = "userTransactionManager")
//    public PlatformTransactionManager userTransactionManager(
//            @Qualifier("entityManagerFactory") EntityManagerFactory entityManagerFactory){
//        return new JpaTransactionManager(entityManagerFactory);
//    }
//}
