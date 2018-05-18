package se.kits.gakusei.config;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

public class CustomAuthenticationSuccessHandler
    implements
        AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest httpServletRequest,
        HttpServletResponse httpServletResponse,
        Authentication authentication
    )
        throws
            IOException,
            ServletException {
        //do some logic here if you want something to be done whenever
        //the user successfully logs in.
        HttpSession session = httpServletRequest.getSession();
        User authUser = (User) SecurityContextHolder.getContext(

        ).getAuthentication().getPrincipal();
        session.setAttribute("username", authUser.getUsername());
        session.setAttribute("authorities", authentication.getAuthorities());

        //set our response to OK status
        httpServletResponse.setStatus(HttpServletResponse.SC_OK);

        //httpServletResponse.sendRedirect("home");
    }

}

