/*
 geoip
 Copyright (c) 2015 Yaroslav Gaponov <yaroslav.gaponov@gmail.com>
*/

var assert = require('assert');
var util = require('util');

function RangeIndex(list, depth) {
    assert(util.isArray(list));

    depth = depth || 13;

    this.list = list
        .filter(function (element) {
            return element && ('start' in element) && ('end' in element) && ('value' in element)
        })
        .sort(function (a, b) {
            return a.start - b.start
        });

    this.root = createTree(0, list.length, depth);

    function createNode(value, left, right) {
        return {
            type: 'NODE',
            value: value,
            left: left,
            right: right
        }
    }

    function createEnd(index) {
        return {
            type: 'END',
            index: index
        }
    }

    function createTree(start, end, depth) {
        if ((depth <= 0) || (start >= end)) {
            return createEnd(start);
        }
        var index = (start + end) >> 1;
        var element = list[index];
        return createNode(element.start, createTree(start, index, depth - 1), createTree(index + 1, end, depth - 1))
    }
}


RangeIndex.prototype.search = function (value) {
    assert(isNaN(value) === false);

    var node = this.root;
    while (node.type === 'NODE') {
        if (value <= node.value) {
            node = node.left
        } else {
            node = node.right;
        }
    }

    assert(node.type, 'END');
    assert(isNaN(node.index) === false);

    var start = node.index;
    for (var i = start; i < this.list.length; i++) {
        if ((value < this.list[i].start) && (value < this.list[i].end)) {
            throw new Error('Element is not found');
        }
        if ((value >= this.list[i].start) && (value <= this.list[i].end)) {
            return this.list[i].value;
        }
    }
}

module.exports = RangeIndex;
