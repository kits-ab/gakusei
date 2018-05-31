package se.kits.gakusei.config;

import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class MvcConfigurer
    extends WebMvcConfigurerAdapter {
    @Value("${spring.caching:false}")
    private boolean caching;

    @Value("${spring.caching-ttl:3600}")
    private int ttl;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        CacheControl cacheControl;
        if (caching) {
            // Caching enabled via spring profile in application.yml
            cacheControl = CacheControl.maxAge(
                ttl,
                TimeUnit.SECONDS
            ).cachePublic();
        } else {
            cacheControl = CacheControl.noStore();
        }
        // Resources outside Spring Security.
        registry.addResourceHandler("/js/**").addResourceLocations(
            "classpath:/static/js/"
        ).setCacheControl(cacheControl);
    }

}

