'use strict';

import V3Store from "/vee3/vee_store.js";

class Tests {
    constructor() {
        describe('unauthenticated api', function() {
            it('/ping', async() => {
                let data = await V3Store.$get('/ping');
                assert(data !== undefined, "/ping ran ok");
                assert(data.status === 'ok', "/ping status is ok");
                console.log(JSON.stringify(data))
            });

            it('/register/interest', async() => {
                let data = await V3Store.$post('/register/interest', { email: 'test@example.com', reason: 'I am testing your api' });
                assert(data !== undefined, "/register/interest ran ok");
                assert(data.msg === 'invalid instanceId', "/register/interest is 'invalid instanceId'");
            });


        });
    }
}

export default Tests