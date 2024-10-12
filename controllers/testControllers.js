
function testControllers(req, res) {
    const response = { message: 'test is working fine' };
    return res.json(response);
}

module.exports = {
    testControllers
};
