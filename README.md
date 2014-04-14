# Generate table by object array

Generate html table by jabascript object array

[![Build Status](https://travis-ci.org/edgardleal/jquery-simpleTable.svg?branch=master)](https://travis-ci.org/edgardleal/jquery-simpleTable)

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/edgardleal/jquery-jquery-simpletable/master/dist/jquery.jquery-simpletable.min.js
[max]: https://raw.github.com/edgardleal/jquery-jquery-simpletable/master/dist/jquery.jquery-simpletable.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery-simpletable.min.js"></script>
<script>
jQuery(function($) {
  $('table').simpleTable({
      'keyField' : 'cod', // used to dont redraw all table, just update the row with id 
      'columns' : [
        {'title' : 'Code', 'field' : 'cod', 'conditions': [ 
            {'expression' : 'value <=0 ', 'cell' : 'color : red'},
            {'expression' : 'value > 0 ', 'cell' : 'color : green'}
          ]},
        {'title' : 'Name'} // When field not informed, it will be assume 'title' field
      ]
    });


  setInterval(function(){
      $.get('/product/list').success(function(data){
           $('table').simpleTable('option', 'data', data);
           $('table').simpleTable('refresh');
        });
    }, 3000);
});
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
