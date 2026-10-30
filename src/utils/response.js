const successResponse = (res, statusCode, message, data, total) => {
    const body = {
        success: true,
        message,
    };

    if (total !== undefined) {
        body.total = total;
    }

    body.data = data;

    return res.status(statusCode).json(body);
};

const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
};

module.exports = { successResponse, errorResponse };
