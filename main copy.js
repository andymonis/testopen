// Knockout is included

import V3Store from "/vee3/vee_store.js";

class Model {
    constructor(api) {
        this.name = ko.observable("testopen");
        // test_output is semi-formatted
        this.test_output = ko.observableArray([]);

        this.btn_run_tests = async() => {
            // Create etest output skeleton and display
            let skeleton = this.tests.skeleton();
            this.test_output(skeleton);
            // Run the tests and display results
            let results = await this.tests.run();
            this.test_output(results);
        }


        this.tests = new Test();

    }
}

class Assert {
    constructor() {
        this.results = [];
    }

    assert(condition, message) {
        let msg = "";
        if (condition === true) {
            msg = `OK: ${message}`;
            // console.log(`OK: ${message}`);
        } else {
            msg = `ERR: ${message}`;
            // console.log(`ERR: ${message}`);
        }
        console.log(msg);
        this.results.push(msg);
    }

    log() {
        return this.results;
    }
}

class Test {
    constructor() {
        this.tests = [];
        // let it = this.it;
        this.it("/ping", async(assert) => {
            let data = await V3Store.$get('/ping');
            assert(data !== undefined, "/ping ran ok");
            assert(data.status === 'ok', "/ping status is ok");
        });
        this.it("/register/interest", async(assert) => {
            let data = await V3Store.$post('/register/interest', { email: 'test@example.com', reason: 'I am testing your api' });
            assert(data !== undefined, "/register/interest ran ok");
            assert(data.msg === 'invalid instanceId', "/register/interest is 'invalid instanceId'");
        });

    }

    it(name, fn) {
        this.tests.push({
            name: name,
            fn: fn
        });
    }

    async run() {
        let skeleton = this.skeleton();

        for (let i = 0; i < this.tests.length; i++) {
            let _test = this.tests[i];
            let asserter = new Assert();
            await _test.fn(asserter.assert.bind(asserter));
            // Assuming tests run in order here
            skeleton[i].result = asserter.log();
        }

        return skeleton;
    }

    skeleton() {
        let skeleton = [];
        for (let i = 0; i < this.tests.length; i++) {
            skeleton.push({ name: this.tests[i].name, result: "" });
        }
        return skeleton;
    }
}

export default class Main {
    constructor(config) {
        try {
            V3Store.instanceId(config.app.instancedid);

            this.model = new Model(this.api);

            ko.applyBindings(this.model);
        } catch (ex) {
            console.log(ex.message)
        }
    }

    async init(config) {

    }
}