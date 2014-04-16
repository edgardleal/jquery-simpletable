(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

asyncTest('Column callbak', function(){
    expect(1);
    setTimeout(function(){
        ok(true, 'Timeout was called');
        start();
      }, 1000);
  });

  module('jQuery#simpleTable', {
    setup: function() {
      this.elems = $('#simpleTable').simpleTable({
        'keyField' : 'Code',
        'editable' : 'true',
        'data' : [{'Code' : '1', 'Name': 'xxxx'}],
        'columns' : [
          {'width' : 30, 'title': 'Code'},
          {'width' : 60, 'title': 'Name'}
        ]
      });
    }
  });


  test('is chainable', function() {
    expect(2);
    // Not a bad test to run on collection methods.
    ok(this.elems, 'elems has initialized');
    strictEqual(this.elems.simpleTable(), this.elems, 'should be chainable');
  });

  test('Check setup head', function() {
    expect(2);
    this.elems = $('#simpleTable').simpleTable();
    ok(this.elems.find('thead').length > 0,
     'shold be 1');

    strictEqual(this.elems.find('th').get(0).innerText,
     'Code', 'shold be simpleTable');
  });

  test('Check setup body', function(){
      expect(1);
      strictEqual(this.elems.find('tbody').length, 1, 'Body shold be initialized');
    });

  test('Check editable', function(){
      expect(2);
      ok(this.elems, 'elems was created');

      ok(this.elems.find('td').attr('contenteditable'), 
          'Td element has the contenteditable attribute');
    });

  test('Check fields', function(){
      expect(3);
      var columns =  this.elems.simpleTable('option', 'columns');
      ok(columns && columns.length > 0, 'Columns option finded');

      for(var i in columns){
        ok(columns[i].field, 'Field ' + i + ' is seted');
      }
    });

  test('Check table body', function(){
      equal(this.elems.find('tbody').length, 1, 'TBody dont exists ');
    });

}(jQuery));
