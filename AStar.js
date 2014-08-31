/* ================================================================
 * AStar.js v0.1.0
 *
 * Javascript implementation of the A* search algorithm
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

;(function(root, factory) {
  'use strict';
  /* amd like aml https://github.com/xudafeng/aml.git */
  if(typeof define === 'function' && define.amd) {
    return define(['exports'], factory);
  } else if(typeof exports !== 'undefined') {
    return factory(exports);
  } else {
    /* browser */
    factory(root['AStar'] || (root['AStar'] = {}));
  }
})(this, function(exports, undefined) {

  var BinaryHeap = this.BinaryHeap;
  if(!BinaryHeap) return;
  BinaryHeap = BinaryHeap.Constructor;
  if(!BinaryHeap) return;

  var Matrix = this.Matrix;
  if(!Matrix) return;
  Matrix = Matrix.Constructor;
  if(!Matrix) return;

  /**
   * mix util
   */
  function mix(r, s) {
    for(var i in s) {
      r[i] = s[i];
    };
    return r;
  };

  /**
   * manhattan distance
   */
  function manhattanDistance($0, $1) {
    return Math.abs($1.x - $0.x) + Math.abs($1.y - $0.y);
  };

  /**
   * calculate path
   */
  function getPath(node) {
    var current = node;
    var path = [];
    while(current.parent) {
      path.push(current);
      current = current.parent;
    }
    return path;
  };

  /**
   * generate data structure
   */
  function generate() {
    for(var i = 0; i < this.matrix.nodes.length; i++) {
      var current = this.matrix.nodes[i];
      current.g = 0;
      current.h = 0;
      current.f = 0;
      current.visited = false;
      current.closed = false;
      current.parent = null;
    }
  }

  function searchPath(start, end) {
    // update static feature
    this.matrix.diagonal = this.options.diagonal;
    // generate data structure, extra data
    generate.call(this);

    // create open list,
    // open list need baniry heap to compare node.f
    this.openList = new BinaryHeap(function(a, b) {
      return a.f - b.f;
    });

    // calculate manhattan distance
    start.h = manhattanDistance(start, end);

    // push start to heap
    this.openList.add(start);
    // until open list is empty
    while (this.openList.size()) {
      var current = this.openList.pop();

      if(current === end) return getPath(current);
      // be closed
      current.closed = true;
      var neighbors = this.matrix.neighbors(current);
      for(var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        if(neighbor.closed || !neighbor.flag.type) continue;
        var visited = neighbor.visited;

        if(!visited || current.g + 1 < neighbor.g) {
          neighbor.visited = true;
          neighbor.parent = current;
          neighbor.h = neighbor.h || manhattanDistance(neighbor, end);
          neighbor.g = current.g + 1;
          neighbor.f = neighbor.g + neighbor.h;

          if(!visited) this.openList.add(neighbor);
        }
      }
    }
    return [];
  }

  /**
   * Constructor of A* Search
   * @param {Array} nodes
   * @param {Object} [options]
   */
  function Constructor(nodes, options) {
    if(typeof nodes !== 'object') throw('Need nodes.');
    this.options = options;
    this.matrix = new Matrix(nodes, options.diagonal);
  };

  var proto = Constructor.prototype;

  /**
   * given a start and end node.
   * @param {Object} start
   * @param {Object} end
   * @return {Array} path
   */
  proto.search = function(start, end) {
    return searchPath.call(this, start, end);
  };

  exports.version = '0.1.0';
  exports.Constructor = Constructor;
});
/* vim: set sw=2 ts=4 et tw=80 : */


