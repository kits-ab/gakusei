package se.kits.gakusei.config;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.WebRequest;

@RequestMapping("/error")
@RestController
public class ErrorHandler implements ErrorController {
    @Autowired
    private ErrorAttributes errorAttributes;

    @Override
    public String getErrorPath() {
        return "/error";
    }

    @RequestMapping
    public ResponseEntity<String> error(HttpServletRequest request, WebRequest webRequest) {
        RequestAttributes requestAttributes = new ServletRequestAttributes(
            request
        );
        final Map<
                String,
                Object
                > errorAttributes = this.errorAttributes.getErrorAttributes(webRequest,
                false
        );
        final int status = (int) errorAttributes.get("status");
        final String message = (String) errorAttributes.get("message");
        return ResponseEntity.status(status).body(message);
    }

}

