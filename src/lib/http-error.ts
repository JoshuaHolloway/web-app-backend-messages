class HttpError extends Error {
  status: string;

  constructor(message: any, error_code: any = 500) {
    super(message);

    this.status = error_code;
  }
}

// module.exports = HttpError;
export default HttpError;
