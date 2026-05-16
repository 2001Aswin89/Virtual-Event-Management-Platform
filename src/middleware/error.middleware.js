const errorHandler = (err, req, res, next) => {
    console.error(err);

    let statusCode = res.statusCode;

    if (statusCode === 200) {
        statusCode = 500;
    }

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        stack:
            process.env.NODE_ENV === 'production'
                ? null
                : err.stack,
    });
};

export default errorHandler;