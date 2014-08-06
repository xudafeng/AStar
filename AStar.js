/* ================================================================
 * AStar.js v1.0.1
 *
 * AStar
 * Latest build : 2014-02-05 20:54:30
 *
 * ================================================================
 * * Copyright (C) 2012-2013 xudafeng <xudafeng@126.com>
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * ================================================================ */

;(function(root, factory){
  'use strict';
  /* amd like aml https://github.com/xudafeng/aml.git */
  if(typeof define === 'function' && define.amd) {
    return define(['exports'], factory);
  }else if(typeof exports !== 'undefined') {
    return factory(exports);
  }else{
    /* browser */
    factory(root['passme'] || (root['passme'] = {}));
  }
})(this, function(exports, undefined){

  var mix = function(r,s) {
    for(var i in s) {
      r[i] = s[i];
    };
    return r;
  }

  function GArray(row, col) {
    var gArray = new Array(row);

    for (var i = 0; i < row; i++) {
      gArray[i] = new Array(col);
    }
    return gArray;
  }

  function rangeRandom(min, max) {
    return parseInt(Math.random() * (max - min + 1) + min);
  }

  var config = {
    row: null,
    col: null,
    start: null,
    end: null,
    openList: [],
    closeList: [],
    map: null
  };

  function AStar(cfg) {
    this.reset(cfg);
  }

  AStar.prototype = {
    generate: function() {
      this.map = this.map || new GArray(this.row, this.col);
      this.start && this.set(this.start[0], this.start[1], 'start');
      this.end && this.set(this.end[0], this.end[1], 'end');
    },
    randomBarriers: function() {
      var total = this.row * this.col;
      for(var i = 0; i < total / 4; i++) {
        this.set(rangeRandom(0, this.col - 1), rangeRandom(0, this.row - 1), 'barrier');
      }
    },
    reset: function(cfg) {
      var c = {};
      mix(c, config);
      mix(c, cfg);
      mix(this, c);
      this.generate();
    },
    set: function(x, y, type){

      if(type === 'start') {
        this.start = [x, y];
      }else if(type === 'end') {
        this.end = [x, y];
      }

      if(this.map[y][x]) return;
      this.map[y][x] = type;
    },
    getRound: function(x, y) {
      var round = [];
      // up
      if(y >= 1 && !this.map[y - 1][x]) {
        round.push([x, y - 1]);
      }
      // right
      if(x + 1 < this.col && !this.map[y][x + 1]) {
        round.push([x + 1, y]);
      }
      // down
      if(y + 1 < this.row && !this.map[y + 1][x]) {
        round.push([x, y + 1]);
      }
      // left
      if(x >= 1 && !this.map[y][x -1]) {
        round.push([x -1, y]);
      }

      return round;
    },
    findPath: function() {
      var that = this;

      if(!this.closeList.length) {
        this.closeList.push(this.start);
      }
      var cur = this.closeList[this.closeList.length - 1];
      var round = this.getRound(cur[0], cur[1]);
      var minIndex = this.findMinIndex(round);

      if(typeof minIndex === 'undefined') {
        alert('No way.');
        return;
      }
      round.forEach(function(i, key) {
        if(key === minIndex) {
          that.closeList.push(i);
          that.map[i[1]][i[0]] = 'path';
        }else {
          that.openList.push(i);
          that.map[i[1]][i[0]] = 'touch';
        }
      });

      if(cur[0] !== this.end[0] && cur[1] !== this.end[1]) {
        return this.findPath();
      }
    },
    findMinIndex: function (arr){
      if(!arr.length) return
      var that = this;
      var index;
      var temp = Infinity;
      arr.forEach(function (i, key){
        var x = i[0];
        var y = i[1];
        var G = Math.abs(x - that.start[0]) + Math.abs(y - that.start[1]);
        var H = Math.abs(x - that.end[0]) + Math.abs(y - that.end[1]);
        var F = G + H;

        if(F < temp) {
          index = key;
          temp = F;
        }
      });

      return index;
    }
  }

  exports.version = '1.0.1';
  exports.AStar = AStar;
});
/* vim: set sw=4 ts=4 et tw=80 : */
