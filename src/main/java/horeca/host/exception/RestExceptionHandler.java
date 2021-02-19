package horeca.host.exception;

import com.auth0.jwt.exceptions.TokenExpiredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpServerErrorException;

@ControllerAdvice
public class RestExceptionHandler extends Throwable {

    @ExceptionHandler
    private ResponseEntity<MessageResponse> handleException(Exception exception){

        MessageResponse error = new MessageResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    private ResponseEntity<MessageResponse> handleException(BindException exception){

        MessageResponse error = new MessageResponse(HttpStatus.BAD_REQUEST.value(), exception.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(value = {NotFoundException.class})
    private ResponseEntity<MessageResponse> handleException(NotFoundException exception){

        MessageResponse error = new MessageResponse(HttpStatus.NOT_FOUND.value(), exception.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler
    private ResponseEntity<MessageResponse> handleException(TokenExpiredException exception){

        MessageResponse error = new MessageResponse(HttpStatus.UNAUTHORIZED.value(), exception.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler
    private ResponseEntity<MessageResponse> handleException(HttpServerErrorException.InternalServerError exception){

        MessageResponse error = new MessageResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), exception.getMessage(), System.currentTimeMillis());

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
