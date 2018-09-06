/*
# js-Logger [![Build Status](https://travis-ci.org/jonnyreeves/js-logger.svg?branch=master)](https://travis-ci.org/jonnyreeves/js-logger) [![npm version](https://badge.fury.io/js/js-logger.svg)](http://badge.fury.io/js/js-logger) ![npm dependencies](https://david-dm.org/jonnyreeves/js-logger.png)

> Lightweight, unobtrusive, configurable JavaScript logger.

[logger.js](https://github.com/jonnyreeves/js-logger/blob/master/src/logger.js) will make you rich, famous and want for almost nothing - oh and it's a flexible abstraction over using `console.log` as well.

## Installation
js-Logger has zero dependencies and comes with AMD and CommonJS module boilerplate.  If the last sentence meant nothing to you then just lob the following into your page:

```html
<script src="https://cdn.rawgit.com/jonnyreeves/js-logger/master/src/logger.min.js"></script>
```

Have a look at [babel-plugin-js-logger](https://github.com/core-process/babel-plugin-js-logger), in case your project utilizes [Babel](https://babeljs.io/), and you want to use js-Logger throughout your entire project efficiently.

## Usage
Nothing beats the sheer ecstasy of logging!  js-Logger does its best to not be awkward and get in the way.  If you're the sort of person who just wants to get down and dirty then all you need is one line of code:

```js
// Log messages will be written to the window's console.
Logger.useDefaults();
```

Now, when you want to emit a red-hot log message, just drop one of the following (the syntax is identical to the `console` object)

```js
Logger.debug("I'm a debug message!");
Logger.info("OMG! Check this window out!", window);
Logger.warn("Purple Alert! Purple Alert!");
Logger.error("HOLY SHI... no carrier.");
Logger.trace("Very verbose message that usually is not needed...");
Logger.trace("...containing stack trace (if console.trace() method supports it)");
```

Log messages can get a bit annoying; you don't need to tell me, it's all cool.  If things are getting too noisy for your liking then it's time you read up on the `Logger.setLevel` method:

```js
// Only log WARN and ERROR messages.
Logger.setLevel(Logger.WARN);
Logger.debug("Donut machine is out of pink ones");  // Not a peep.
Logger.warn("Asteroid detected!");  // Logs "Asteroid detected!", best do something about that!

// Ah, you know what, I'm sick of all these messages.
// But I want to see them again later
var oldLevel = Logger.getLevel();
Logger.setLevel(Logger.OFF);
Logger.error("Hull breach on decks 5 through to 41!");  // ...

// Actually, maybe those logs were quite useful...
Logger.setLevel(oldLevel);

```

## Log Handler Functions
All log messages are routed through a handler function which redirects filtered messages somewhere.  You can configure the handler function via `Logger.setHandler` noting that the supplied function expects two arguments; the first being the log messages to output and the latter being a context object which can be inspected by the log handler.

```js
Logger.setHandler(function (messages, context) {
	// Send messages to a custom logging endpoint for analysis.
	// TODO: Add some security? (nah, you worry too much! :P)
	jQuery.post('/logs', { message: messages[0], level: context.level });
});
```

### Default Log Handler Function
js-Logger provides a default handler function which writes to your browser's `console` object using the appropriate logging functions based on the message's log level (ie: `Logger.info()` will result in a call to `console.info()`).  The default handler automatically shims for sub-optiomal environments right down to IE7's complete lack of `console` object (it only appears when you open the DevTools - seriously, this is one of the anti-user troll things I've seen!)

Use `Logger.createDefaultHandler()` to return a new log handler function which can then be supplied to `Logger.setHandler()`.

You can customise the formatting of each log message by supplying a formatter function to `createDefaultHandler`:

```js
Logger.createDefaultHandler({
	formatter: function(messages, context) {
		// prefix each log message with a timestamp.
		messages.unshift(new Date().toUTCString())
	}
});
```

You can use functional composition to extend the default handler with your own custom handler logic:

```js
var consoleHandler = Logger.createDefaultHandler();
var myHandler = function (messages, context) {
	jQuery.post('/logs', { message: messages[0], level: context.level });
};

Logger.setHandler(function (messages, context) {
	consoleHandler(messages, context);
	myHandler(messages, context);
});

```

### useDefaults
`Logger.useDefaults()` is a convenience function which allows you to configure both the default logLevel and handler in one go:

```js
Logger.useDefaults({
	defaultLevel: Logger.WARN,
	formatter: function (messages, context) {
		messages.unshift(new Date().toUTCString())
	}
})
```

## Named Loggers
Okay, let's get serious, logging is not for kids, it's for adults with serious software to write and mission critical log messages to trawl through.  To help you in your goal, js-Logger provides 'named' loggers which can be configured individual with their own contexts.

```js
// Retrieve a named logger and store it for use.
var myLogger = Logger.get('ModuleA');
myLogger.info("FizzWozz starting up");

// This logger instance can be configured independent of all others (including the global one).
myLogger.setLevel(Logger.WARN);

// As it's the same instance being returned each time, you don't have to store a reference:
Logger.get('ModuleA').warn('FizzWozz combombulated!');
```

Note that `Logger.setLevel()` will also change the current log filter level for all named logger instances; so typically you would configure your logger levels like so:

```js
// Create several named loggers (typically in their own module)
var loggerA = Logger.get('LoggerA');
var loggerB = Logger.get('LoggerB');
var loggerC = Logger.get('LoggerC');

// Configure log levels.
Logger.setLevel(Logger.WARN);  // Global logging level.
Logger.get('LoggerB').setLevel(Logger.DEBUG);  // Enable debug logging for LoggerB
Logger.get('LoggerC').setLevel(Logger.TRACE);  // Enable trace logging for LoggerC
```

## Profiling
Sometimes its good to know what's taking so damn long; you can use `Logger.time()` and `Logger.timeEnd()` to keep tabs on things, the default log handler implementation delegates to the equivalent console methods if they exist, or write to `console.log` if they don't.

```js
// Start timing something
Logger.time('self destruct sequence');

// ... Some time passes ...

// Stop timing something.
Logger.timeEnd('self destruct sequence'); // logs: 'self destruct sequence: 1022ms'.
```

Note that `time` and `timeEnd` methods are also provided to named Logger instances.
*/

// Top level module for the global, static logger instance.
var Logger = { };

// For those that are at home that are keeping score.
Logger.VERSION = '1.4.1';

// Function which handles all incoming log messages.
var logHandler;

// Map of ContextualLogger instances by name; used by Logger.get() to return the same named instance.
var contextualLoggersByNameMap = {};

// Polyfill for ES5's Function.bind.
var bind = function(scope, func) {
    return function() {
        return func.apply(scope, arguments);
    };
};

    // Super exciting object merger-matron 9000 adding another 100 bytes to your download.
var merge = function () {
    var args = arguments, target = args[0], key, i;
    for (i = 1; i < args.length; i++) {
        for (key in args[i]) {
            if (!(key in target) && args[i].hasOwnProperty(key)) {
                target[key] = args[i][key];
            }
        }
    }
    return target;
};

    // Helper to define a logging level object; helps with optimisation.
var defineLogLevel = function(value, name) {
    return { value: value, name: name };
};

    // Predefined logging levels.
Logger.TRACE = defineLogLevel(1, 'TRACE');
Logger.DEBUG = defineLogLevel(2, 'DEBUG');
Logger.INFO = defineLogLevel(3, 'INFO');
Logger.TIME = defineLogLevel(4, 'TIME');
Logger.WARN = defineLogLevel(5, 'WARN');
Logger.ERROR = defineLogLevel(8, 'ERROR');
Logger.OFF = defineLogLevel(99, 'OFF');

// Inner class which performs the bulk of the work; ContextualLogger instances can be configured independently
// of each other.
var ContextualLogger = function(defaultContext) {
    this.context = defaultContext;
    this.setLevel(defaultContext.filterLevel);
    this.log = this.info;  // Convenience alias.
};

ContextualLogger.prototype = {
    // Changes the current logging level for the logging instance.
    setLevel: function (newLevel) {
        // Ensure the supplied Level object looks valid.
        if (newLevel && typeof newLevel === 'object' && 'value' in newLevel) {
            this.context.filterLevel = newLevel;
        }else if(typeof newLevel === 'string' && Logger[newLevel.toUpperCase()]){

            this.context.filterLevel = Logger[newLevel.toUpperCase()];
        }
    },
		
    // Gets the current logging level for the logging instance
    getLevel: function () {
        return this.context.filterLevel;
    },

    // Is the logger configured to output messages at the supplied level?
    enabledFor: function (lvl) {
        var filterLevel = this.context.filterLevel;
        return lvl.value >= filterLevel.value;
    },

    trace: function () {
        this.invoke(Logger.TRACE, arguments);
    },

    debug: function () {
        this.invoke(Logger.DEBUG, arguments);
    },

    info: function () {
        this.invoke(Logger.INFO, arguments);
    },

    warn: function () {
        this.invoke(Logger.WARN, arguments);
    },

    error: function () {
        this.invoke(Logger.ERROR, arguments);
    },

    time: function (label) {
        if (typeof label === 'string' && label.length > 0) {
            this.invoke(Logger.TIME, [ label, 'start' ]);
        }
    },

    timeEnd: function (label) {
        if (typeof label === 'string' && label.length > 0) {
            this.invoke(Logger.TIME, [ label, 'end' ]);
        }
    },

    // Invokes the logger callback if it's not being filtered.
    invoke: function (level, msgArgs) {
        if (logHandler && this.enabledFor(level)) {
            logHandler(msgArgs, merge({ level: level }, this.context));
        }
    }
};

// Protected instance which all calls to the to level `Logger` module will be routed through.
var globalLogger = new ContextualLogger({ filterLevel: Logger.OFF });

// Configure the global Logger instance.
(function() {
    // Shortcut for optimisers.
    var L = Logger;

    L.enabledFor = bind(globalLogger, globalLogger.enabledFor);
    L.trace = bind(globalLogger, globalLogger.trace);
    L.debug = bind(globalLogger, globalLogger.debug);
    L.time = bind(globalLogger, globalLogger.time);
    L.timeEnd = bind(globalLogger, globalLogger.timeEnd);
    L.info = bind(globalLogger, globalLogger.info);
    L.warn = bind(globalLogger, globalLogger.warn);
    L.error = bind(globalLogger, globalLogger.error);

    // Don't forget the convenience alias!
    L.log = L.info;
}());

// Set the global logging handler.  The supplied function should expect two arguments, the first being an arguments
// object with the supplied log messages and the second being a context object which contains a hash of stateful
// parameters which the logging function can consume.
Logger.setHandler = function (func) {
    logHandler = func;
};

// Sets the global logging filter level which applies to *all* previously registered, and future Logger instances.
// (note that named loggers (retrieved via `Logger.get`) can be configured independently if required).
Logger.setLevel = function(level) {
    // Set the globalLogger's level.
    globalLogger.setLevel(level);

    // Apply this level to all registered contextual loggers.
    for (var key in contextualLoggersByNameMap) {
        if (contextualLoggersByNameMap.hasOwnProperty(key)) {
            contextualLoggersByNameMap[key].setLevel(level);
        }
    }
};

// Gets the global logging filter level
Logger.getLevel = function() {
    return globalLogger.getLevel();
};

// Retrieve a ContextualLogger instance.  Note that named loggers automatically inherit the global logger's level,
// default context and log handler.
Logger.get = function (name) {
    // All logger instances are cached so they can be configured ahead of use.
    return contextualLoggersByNameMap[name] ||
			(contextualLoggersByNameMap[name] = new ContextualLogger(merge({ name: name }, globalLogger.context)));
};

// CreateDefaultHandler returns a handler function which can be passed to `Logger.setHandler()` which will
// write to the window's console object (if present); the optional options object can be used to customise the
// formatter used to format each log message.
Logger.createDefaultHandler = function (options) {
    options = options || {};

    options.formatter = options.formatter || function defaultMessageFormatter(messages, context) {
        // Prepend the logger's name to the log message for easy identification.
        if (context.name) {
            messages.unshift('[' + context.name + ']');
        }
    };

    // Map of timestamps by timer labels used to track `#time` and `#timeEnd()` invocations in environments
    // that don't offer a native console method.
    var timerStartTimeByLabelMap = {};

    // Support for IE8+ (and other, slightly more sane environments)
    var invokeConsoleMethod = function (hdlr, messages) {
        Function.prototype.apply.call(hdlr, console, messages);
    };

        // Check for the presence of a logger.
    if (typeof console === 'undefined') {
        return function () { /* no console */ };
    }

    return function(messages, context) {
        // Convert arguments object to Array.
        messages = Array.prototype.slice.call(messages);

        var hdlr = console.log;
        var timerLabel;

        if (context.level === Logger.TIME) {
            timerLabel = (context.name ? '[' + context.name + '] ' : '') + messages[0];

            if (messages[1] === 'start') {
                if (console.time) {
                    console.time(timerLabel);
                }
                else {
                    timerStartTimeByLabelMap[timerLabel] = new Date().getTime();
                }
            }
            else {
                if (console.timeEnd) {
                    console.timeEnd(timerLabel);
                }
                else {
                    invokeConsoleMethod(hdlr, [ timerLabel + ': ' +
							(new Date().getTime() - timerStartTimeByLabelMap[timerLabel]) + 'ms' ]);
                }
            }
        }
        else {
            // Delegate through to custom warn/error loggers if present on the console.
            if (context.level === Logger.WARN && console.warn) {
                hdlr = console.warn;
            } else if (context.level === Logger.ERROR && console.error) {
                hdlr = console.error;
            } else if (context.level === Logger.INFO && console.info) {
                hdlr = console.info;
            } else if (context.level === Logger.DEBUG && console.debug) {
                hdlr = console.debug;
            } else if (context.level === Logger.TRACE && console.trace) {
                hdlr = console.trace;
            }

            options.formatter(messages, context);
            invokeConsoleMethod(hdlr, messages);
        }
    };
};

// Configure and example a Default implementation which writes to the `window.console` (if present).  The
// `options` hash can be used to configure the default logLevel and provide a custom message formatter.
Logger.useDefaults = function(options) {
    Logger.setLevel(options && options.defaultLevel || Logger.DEBUG);
    Logger.setHandler(Logger.createDefaultHandler(options));
};
Logger.useDefaults();
export default Logger;