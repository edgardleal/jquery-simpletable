/*! jquery-simpletable - v0.0.1 - 2014-04-21
* https://github.com/edgardleal/jquery-simpletable
* Copyright (c) 2014 Edgard Leal; Licensed MIT */
var __x = eval;
(function ($) {
   $.widget("custom.simpleTable", {
      options : {
        keyField : null,
        data : void 0,
        url : void 0,
        // turn table editable
        editable : false,
        // when call save , or autoSave us true, the edited row will send to server like 
        // a html form. Ex.: name=X&tel=5555
        postAsForm : true,
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
       * Partial code coped from jQuery api
       */
      _serializeRow : function($row){
          var self = this;
          var r20 = /%20/g;
          var result = '{';
          var list = [];
          var $td = $row.find('td');
          if(self.options.postAsForm){
            $td.each(function(i, ele){
                var $ele = $(ele),
                $inputs = $ele.find('input select textarea keygen');
                if($inputs.length){
                  list[list.length] = encodeURIComponent($inputs.attr('name') + 
                    '=' + encodeURIComponent($inputs.val()));
                }else{
                  list[list.length] = encodeURIComponent($ele.attr('name')) + 
                    '=' + encodeURIComponent($ele.text());
                }
              });
            list.push('_id=' + encodeURIComponent($row.attr('id')));
            return list.join('&').replace(r20, '+');
          }else{
            for(var i in self.options.columns){
              result += 
                (result==='{'?'':',')+  '"' + 
                self.options.columns[i].field + 
                '":"' + $td.get(i).innerText + '"';
            }
            result = result + (result==='{'?'':',') + 
              '"_id" : "' + $row.attr('id') + '"';
            return result + '}';
          }
        },
      save : function($row){
        var self = this;
        if(self.options.url){
          $.ajax({
              'type' : 'POST',
              'dataType' : 'json',
              'url' : self.options.url,
              'data' : self._serializeRow($row)
            });
        }
      },
      /**
       * Create a table row with number of cols passed 
       * and insert the row in table body
       */
      _createRow : function(cols, id){
          var self = this;
          var html = '<tr id="' + id + '">';
          var parameters = self.options.editable?'contenteditable="true"':'';
          self._each(cols, function(i, col){
              html += '<td name="' + col.field + '" ' + 
                parameters + ' class="ui-widget-content"></td>';
            });
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
            if(self.options.editable){
              $row.find('td').blur(function(){
                  $row.modified = true;
                  if(self.options.autosave){
                    self.save($row);
                  }
                });
            }
          return $row;
        },
      checkCondition : function(value, expression){
            var localexpression = 'var value="' + value + '"\n';
            localexpression += expression;
            try{
              return __x(localexpression);
            }catch(ex){
              
            }
        },
      _buildCellHtml : function(obj, column, $row, cellElement){
          var result = obj[column.field];
          if(column.mapFunction && typeof column.mapFunction === 'function'){
            result = column.mapFunction.call(this, obj, column, $row, cellElement);
          }
          return result;
        },
      _refreshRow : function(obj){
          var self = this;
          var id = obj[self.options.keyField];
          if(!id){
            throw 'keyField not pased';
          }
          var row = self.body.find('tr[id=' + id + ']');
          if(!row || row.length < 1){
            row = self._createRow(self.options.columns, id);
          }
          var columnIndex = 0;
          var $columns = row.find('td');
          for(var i in self.options.columns){
            var column = self.options.columns[i];
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
            cellElement.innerHTML = self._buildCellHtml(obj, column, row, cellElement);
          }// for
        },
      /**
       *
       * url -> the url where come the data, if undefined, will be use this.options.url if any informed, will exit 
       * callback -> any function to be called when the data reader is finished 
       */
      refreshremote : function(url, callback){
          var self = this;
          var _url = url?url:self.options.url;
          if(!_url){
            return this;
          }else{
            $.get(_url).success(function(data){
                for(var i in data){
                  self._refreshRow(data[i]);
                }
                if(callback && typeof callback === 'function'){
                  callback.call(self, data);
                }
              });
          }
        },
      refresh : function(){
          var self = this;
          if(self.options.url){
            self.refreshremote();
          }else{
            for(var i in self.options.data){
              self._refreshRow(self.options.data[i]);
            }
          }
        },
      _each : function(list, callBack, end){
        for(var i in list){
          callBack.call(this, i, list[i]);
        }
        if(end && typeof end === 'function'){
          end.call(this);
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

  $.expr[':'].simpletable = function (elem) {
    // Is this element awesome?
    return $(elem).hasClass('simpletable');
  };

})(jQuery);
