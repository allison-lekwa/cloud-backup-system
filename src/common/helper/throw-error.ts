export class ApplicationError extends Error {
  constructor(message: string) {
      super();
      this.message = message;
  }

  getCode() { return 500; }
};

// HTTP 401 Unauthorized -> Invalid login credentials
export class UnauthorizedException extends ApplicationError {
  constructor(message: string) {
      super(message);
      this.name = 'Unauthorized';
  }
  getCode() { return 401; }
}

// HTTP 409 Conflict -> Duplication
export class  ConflictException extends ApplicationError {
  constructor(message: string) {
      super(message);
      this.name = 'Conflict';
  }
  getCode() { return 409; }
}

// 403 Forbidden
export class ForbiddenException extends ApplicationError {
  constructor(message: string) {
      super(message);
      this.name = 'Forbidden';
  }
  getCode() { return 403; }
}

// HTTP 400 BadRequest -> Authorized to perform request
export class BadRequestException extends ApplicationError {
  constructor(message: string) {
      super(message);
      this.name = 'BadRequest';
  }
  getCode() { return 400; }
};

// HTTP 404 NotFound -> Resource not found
export class NotFoundException extends ApplicationError {
  constructor(message: string) {
      super(message);
      this.name = 'NotFound';
  }

  getCode() { return 404; }    
};

// HTTP 408 Timeout -> Too much time to retrieve resource
export class RequestTimeoutException extends ApplicationError {
  constructor(message: string) {
      super(message);
      this.name = 'RequestTimeout';
  }

  getCode() { return 408; }    
};
