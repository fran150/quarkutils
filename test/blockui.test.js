    describe('Web - UI Block Tests', function() {
        var body;
        var test;

        describe('Testing over an element', function() {
            beforeEach(function(done) {
                body = $(document).find('body');
                $('<div id=\'test\'></div>').appendTo(body);
                test = $(body).find('#test');
                $$.block('Loading...', test);
                setTimeout(function() {
                    done();
                }, 1000);
            });

            afterEach(function() {
                $(test).remove();
            });

            it('Must show a blocking message', function() {
                var blocked = $(test).find('.blockUI');
                expect(blocked.length).toBeGreaterThan(0);
            });

            it('Must unblock the element', function(done) {
                $$.unblock(test);
                setTimeout(function() {
                    var blocked = $(test).find('.blockUI');
                    expect(blocked.length).toBe(0);
                    done();
                }, 1000);
            });
        });

        describe('Testing over entire page', function() {
            beforeEach(function(done) {
                $$.block('Loading...');
                setTimeout(function() {
                    done();
                }, 1000);
            });

            it('Must show a blocking message on entire screen', function() {
                var blocked = $(document).find('.blockUI');
                expect(blocked.length).toBeGreaterThan(0);
            });

            it('Must unblock the entire screen', function(done) {
                $$.unblock();
                setTimeout(function() {
                    var blocked = $(document).find('.blockUI');
                    expect(blocked.length).toBe(0);
                    done();
                }, 1000);
            });
        });

    });
