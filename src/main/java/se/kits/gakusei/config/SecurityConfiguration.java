package se.kits.gakusei.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@EnableWebSecurity
public class SecurityConfiguration
    extends WebSecurityConfigurerAdapter {
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth)
        throws
            Exception {
        auth.userDetailsService(this.userDetailsService).passwordEncoder(
            passwordEncoder()
        );
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/js/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers(
            "/registeruser",
            "/username",
            "/js/*",
            "/license/*",
            "/img/logo/*"
        ).permitAll().antMatchers("/logout").hasAnyAuthority(
            "ROLE_USER",
            "ROLE_ADMIN"
        ).and().formLogin().loginPage("/").loginProcessingUrl(
            "/auth"
        ).failureHandler(
            new CustomAuthenticationFailureHandler()
        ).successHandler(new CustomAuthenticationSuccessHandler()).permitAll(

        ).and().httpBasic().and().headers().frameOptions().sameOrigin().and().csrf().csrfTokenRepository(
            CookieCsrfTokenRepository.withHttpOnlyFalse()
        ).and().logout().logoutSuccessUrl("/").deleteCookies("JSESSIONID").and(
        ).rememberMe().key("uniqueAndSecret");

        http.csrf().disable();
    }

}

