'use strict';
exports.showAlias = {
    description: 'Returns the dashboard',
    handler: function(request, reply) {
        reply.view('dashboard/alias');
    },
    tags: ['api'] //swagger documentation
};