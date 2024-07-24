'use strict'

function listen(target, eventType, callback) {
  if (target == null) {
    throw new TypeError('target must be provided')
  }
  if (Object.prototype.toString.call(eventType) !== '[object String]') {
    throw new TypeError('eventType must be a string')
  }

  var eventTypes = eventType.split(' ').filter(Boolean)
  if (eventTypes.length === 0) {
    throw new Error('eventType must not be blank')
  }

  if (target.addEventListener) {
    eventTypes.forEach(function(eventType) {
      target.addEventListener(eventType, callback, false)
    })
    return {
      remove: function() {
        eventTypes.forEach(function(eventType) {
          target.removeEventListener(eventType, callback, false)
        })
      }
    }
  }
  else if (target.attachEvent) {
    eventTypes.forEach(function(eventType) {
      target.attachEvent('on' + eventType, callback)
    })
    return {
      remove: function() {
        eventTypes.forEach(function(eventType) {
          target.detachEvent('on' + eventType, callback)
        })
      }
    }
  }
  else {
    throw new TypeError('target must have addEventListener or attachEvent')
  }
}

module.exports = listen
