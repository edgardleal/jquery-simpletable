/*! jquery-simpletable - v0.0.1 - 2014-04-14
* https://github.com/edgardleal/jquery-simpletable
* Copyright (c) 2014 Edgard Leal; Licensed MIT */
var __x = eval;
(function ($) {
   $.widget("custom.simpleTable", {
      options : {
        keyField : null,
        data : void 0,
        url : void 0,
        columns : [],
        table : null,
        border : 1
       },
      setStyle : function(){
         $(".jtable th").each(function(){
           $(this).addClass("ui-state-default");
          });
           $(".jtable td").each(function(){
              $(this).addClass("ui-widget-content");
            });
        },
      _setupHead : function(){
          var self = this;
          var html = '<thead><tr class="ui-widget-header">';
          for(var i in self.options.columns){
            html += '<th clas="ui-state-default" width="' + 
              self.options.columns[i].width + '">' + 
              self.options.columns[i].title + '</th>';
          }
          self.element.prepend($(html + '</tr>'));
        },
      _setupBody : function(){
          var html = '<tbody></tbody>';
          this.body = this.element.append(html);
          return this.bory;
        },
      _findColumn : function(title){
        for(var i in this.options.columns){
          if(this.options.columns[i].title === title){
            return this.options.columns[i];
          }
        }
      },
      /**
       * Create a table row with number of cols passed 
       * and insert the row in table body
       */
      _createRow : function(cols, id){
          var self = this;
          var html = '<tr id="' + id + '">';
          for(var i = 1 ; i <= cols; i++){
            html += '<td class="ui-widget-content"></td>';
          }
          var $row = $(html + '</tr>');
          self.body.append($row);
          $row.hover(
            function(){
              $(this).children("td").addClass("ui-state-hover");
            },
            function(){
              $(this).children("td").removeClass("ui-state-hover");
            }).click(function(){
              $(this).children("td").toggleClass("ui-state-highlight");
            });
          return $row;
        },
      _buildCellHtml : function(obj, column){
          var result = obj[column.field];
          if(typeof column.mapFunction && column.mapFunction === 'function'){
            result = column.mapFunction.call(result);
          }
          return result;
        },
      _refreshRow : function(obj){
          var self = this;
          var fields = Object.keys(obj);
          var id = obj[self.options.keyField];
          if(!id){
            throw 'keyField not pased';
          }
          var row = self.body.find('tr[id=' + id + ']');
          if(!row || row.length < 1){
            row = self._createRow(self.options.columns.length, id);
          }
          var columnIndex = 0;
          var $columns = row.find('td');
          for(var i in fields){
            var column = self._findColumn(fields[i]);
            if(!column){
              continue;
            }
            var value = obj[column.field];
            var localexpression = 'var value="' + value + '"\n';
            var cellElement = $columns.get(columnIndex++);
            if(column.conditions){
              for(var f in column.conditions){
                try{
                  if(__x(localexpression + column.conditions[f].expression)){
                    var cellCss = column.conditions[f].cell;
                    var parentCss = column.conditions[f].parent;
                    if(cellCss){
                      cellElement.style.cssText = cellCss;
                    }
                    if(parentCss){
                      row.get(0).style.cssText = parentCss;
                    }
                    break;
                  }// if expressions
                }catch(ex){

                }
              }// for conditions
            }// if
            cellElement.innerHTML = self._buildCellHtml(obj, column);
          }// for
        },
      refresh : function(){
          var self = this;
          for(var i in self.options.data){
            self._refreshRow(self.options.data[i]);
          }
        },
      _create : function(){
          var self = this;
          self.head = self.element.find('thead');
          if(!self.head.length){
            self._setupHead();
          }
          self.body = self.element.find('tbody');
          if(!self.body.length){
            self._setupBody();
          }
          for(var i in self.options.columns){
            if(!self.options.columns[i].field){
              self.options.columns[i].field = 
                self.options.columns[i].title;
            }
          }
          self.element.addClass('ui-widget')
           .attr('border', self.options.border);
          this.refresh();
        }
   });
    

  $.expr[':'].awesome = function (elem) {
    // Is this element awesome?
    return $(elem).text().indexOf('awesome') !== -1;
  };

})(jQuery);
