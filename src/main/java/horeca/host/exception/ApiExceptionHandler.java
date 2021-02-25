package horeca.host.exception;

import com.auth0.jwt.exceptions.TokenExpiredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpServerErrorException;

@ControllerAdvice
public class ApiExceptionHandler extends Throwable {

    @ExceptionHandler
    private ResponseEntity<ApiException> handleException(Exception exception){

        ApiException error =
                new ApiException(
                        HttpStatus.BAD_REQUEST.value(),
                        exception.getMessage(),
                        System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<ApiException> handleException(BindException exception){

        ApiException error =
                new ApiException(
                        HttpStatus.BAD_REQUEST.value(),
                        exception.getMessage(),
                        System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(value = {ApiRequestHandler.class})
    private ResponseEntity<ApiException> handleException(ApiRequestHandler exception){

        ApiException error =
                new ApiException(HttpStatus.NOT_FOUND.value(),
                        exception.getMessage(),
                        System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler
    private ResponseEntity<ApiException> handleException(TokenExpiredException exception){

        ApiException error =
                new ApiException(
                        HttpStatus.UNAUTHORIZED.value(),
                        exception.getMessage(),
                        System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler
    private ResponseEntity<ApiException> handleException(HttpServerErrorException.InternalServerError exception){

        ApiException error =
                new ApiException(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        exception.getMessage(),
                        System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
