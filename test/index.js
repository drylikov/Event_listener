'use strict'

var test = require('tape')

var listen = require('../index')

test('Argument validation', function(t) {
  t.plan(5)
  t.throws(function() { listen(null, 'click', function() {}) },
           /target must be provided/,
           'target must be provided')
  t.throws(function() { listen({}, 'click', function() {}) },
           /target must have addEventListener or attachEvent/,
           'target must have addEventListener or attachEvent')
  t.throws(function() { listen({}, 42, function() {}) },
           /eventType must be a string/,
           'eventType must be a string')
  t.throws(function() { listen({}, '', function() {}) },
           /eventType must not be blank/,
           'eventType must not be blank')
  t.throws(function() { listen({}, ' ', function() {}) },
           /eventType must not be blank/,
           'eventType must not be blank')
})

test('Uses addEventListener API when available', function(t) {
  t.plan(2)

  var element = {
    _addedEvents: [],
    _removedEvents: [],
    addEventListener: function(eventType) {
      this._addedEvents.push(eventType)
    },
    removeEventListener: function(eventType) {
      this._removedEvents.push(eventType)
    }
  }

  var returnValue = listen(element, new String('click'), function() {})
  t.deepEqual(element._addedEvents, ['click'])

  returnValue.remove()
  t.deepEqual(element._removedEvents, ['click'])
})

test('Uses addEvent API when available', function(t) {
  t.plan(2)

  var element = {
    _addedEvents: [],
    _removedEvents: [],
    attachEvent: function(eventType) {
      this._addedEvents.push(eventType)
    },
    detachEvent: function(eventType) {
      this._removedEvents.push(eventType)
    }
  }

  var returnValue = listen(element, 'click', function() {})
  t.deepEqual(element._addedEvents, ['onclick'])

  returnValue.remove()
  t.deepEqual(element._removedEvents, ['onclick'])
})

test('Multiple events', function(t) {
  t.plan(2)

  var element = {
    _addedEvents: [],
    _removedEvents: [],
    addEventListener: function(eventType) {
      this._addedEvents.push(eventType)
    },
    removeEventListener: function(eventType) {
      this._removedEvents.push(eventType)
    }
  }

  var returnValue = listen(element, 'a b c', function() {})
  t.deepEqual(element._addedEvents, ['a', 'b', 'c'])

  returnValue.remove()
  t.deepEqual(element._removedEvents, ['a', 'b', 'c'])
})
