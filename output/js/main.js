/**
 * Task:
 * Main Description:
 * 1) Create 3 Classes which describe Employee. One Abstract Class and two concrete implementations.
 *    First implementation - Employee with fixed salary. Where average monthly salary = employee salary.
 *    Second implementation - Employee with per-hour salary. Where average monthly salary = 20.8 * 8 * employee salary.
 *
 *    In abstract Employee Class describe an abstract method which calculates Employee average monthly salary (method:getSalary).
 *
 * 2) Create Class which represent collection of Employees.
 *    1. Collection of Employees must be sorted by the next rules:
 *       Sort all workers in descending order of average monthly salary.
 *       If average monthly salary of Employees is equal use Employee name instead.
 *    2. Ability to get five first employee names from collection.
 *    3. Ability to get last three employee ids from collection.
 *
 * 3) Organize ability to get Employees Data from different sources (AJAX, Textarea on the page).
 *    Note here:
 *    For example on Monday we want to fetch data from Back End but on Sunday we want to get data from textarea on the page.
 *
 * 4) Protect your classes from incorrect input. Meaningful error handling.
 *
 * Additional notes:
 * You can use lodash/underscore libs.
 * jQuery for DOM manipulations/AJAX if needed.
 * if you want to use Async Flow Control use Q, jQuery.Deferred(). Q is preferable.
 * MVC frameworks are prohibited here.
 *
 * Optional:
 * Use AMD(Require.js for example).
 * Tests
 *
 */

;
(function () {
    'use strict';


    var Class = function () {};
    var extend = function (protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    };
    Class.extend = extend;


    var AbstractEmployee = Class.extend({
        constructor: function (attributes) {
            this.attributes = {};
            this.set(attributes);
        },
        getMonthlySalary: function () {
            throw new Error('Redefine \'getMonthlySalary\' method.');
        },
        set: function (attributes) {
            _.extend(this.attributes, attributes);
            return this;
        },
        get: function (attr) {
            return this.attributes[attr];
        },
        toJSON: function () {
            return _.clone(this.attributes);
        }
    }, {
        isEmployee: function (employee) {
            return employee instanceof this;
        }
    });

    var HourlySalaryEmployee = AbstractEmployee.extend({
        getMonthlySalary: function () {
            return 20.8 * 8 * this.get('salary');
        }
    });

    var FixedSalaryEmployee = AbstractEmployee.extend({
        getMonthlySalary: function () {
            return this.get('salary');
        }
    });


    var EmployeesFactory = (function () {
        var _constructors = {
            'HourlySalaryEmployee': HourlySalaryEmployee,
            'FixedSalaryEmployee': FixedSalaryEmployee
        };

        return {
            create: function (type, arrgs) {
                var Employee = _constructors[type];
                if (!Employee) {
                    throw new Error('Type of "' + type + '" is absent');
                }

                return new Employee(arrgs);
            },
            isEmployee: function (employee) {
                return AbstractEmployee.isEmployee(employee);
            }
        };
    })();


    var EmployeesCollection = Class.extend({
        constructor: function (employees, options) {
            this.employees = [];
            this.options = {};
            this.set(employees);
            this._configure(options || {});
        },
        load: function (transport) {
            transport.fetch().done(this.set.bind(this));
        },
        save: function (transport) {
            transport.save(this.toJSON());
        },
        getFirstFivesNames: function () {
            return _.map(this._getByRange(0, 5), function (employee) {
                return employee.get('name');
            });
        },
        getLastThreeIds: function () {
            return _.map(this._getByRange(-3), function (employee) {
                return employee.get('id');
            });
        },
        toJSON: function () {
            return _.map(this.emplyees, function (emplyee) {
                return emplyee.toJSON();
            });
        },
        set: function (employees) {
            if (employees) {
                employees = _.isArray(employees) ? employees : [employees];
                _.each(employees, this._push, this);
            }
            return this;
        },
        _push: function (employee) {
            employee = EmployeesFactory.isEmployee(employee) ? employee : EmployeesFactory.create(obj.type, obj);
            this.employees.push(employee);
            this._sort();
        },
        _sort: function () {
            this.employees.sort(function (emploeeA, emploeeB) {
                var a, b;
                a = emploeeA.getMonthlySalary();
                b = emploeeB.getMonthlySalary();

                if (a === b) {
                    return this._compare(emploeeA.get('name'), emploeeB.get('name'));
                }

                return this._compare(a, b);
            });
        },
        _compare: function (a, b) {
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }

            return typeof a < typeof b ? -1 : 1;
        },
        _getByRange: function (from, to) {
            return this.employees.slice.apply(this.employees, arguments);
        },
        _configure: function (options) {
            _.extend(this.options, options);
            _.extend(this, _.pick(this.options, ['transport']));
        }
    });


    var AbstractTransport = Class.extend({
        save: function () {
            throw new Error('Redefine \'save\' method. Has to return promise.');
        },
        fetch: function () {
            throw new Error('Redefine \'fetch\' method. Has to return promise.');
        }
    });

    var TextareaTransport = AbstractTransport.extend({
        constructor: function (el) {
            this.init.apply(this, arguments);
        },
        init: function (el){
            this.el = el;
        },
        fetch: function () {
            var dfd = $.Deferred();
            _.defer(dfd.resolve.bind(dfd, this.el.val()));
            return dfd.promise();
        },
        save: function (emplyees) {
            this.el.val(emplyees);
        }
    });

    var MockTransport = AbstractTransport.extend({
        fetch: function () {
            var dfd = $.Deferred();
            _.defer(dfd.resolve.bind(dfd, mock));
            return dfd.promise();
        },
        save: function (emplyees) {
            console.log(emplyees);
        }
    });

    var mock = [
        {
            "type": "HourlySalaryEmployee",
            "salary": 10000,
            "name": "Anna",
            "id": 1
        },
        {
            "type": "HourlySalaryEmployee",
            "salary": 8,
            "name": "Bob",
            "id": 2
        },
        {
            "type": "FixedSalaryEmployee",
            "salary": 8000,
            "name": "Dany",
            "id": 3
        },
        {
            "type": "FixedSalaryEmployee",
            "salary": 8000,
            "name": "Clara",
            "id": 4
        },
        {
            "type": "FixedSalaryEmployee",
            "salary": 1000,
            "name": "Egor",
            "id": 5
        }
    ];


    var employees = new EmployeesCollection([], {
        transport: new MockTransport()
    });

    var transport = new MockTransport();

    employees.fetch();

    employees.load(transport);
    employees.save(transport);

    console.log(employees.getFirstFive());
    console.log(employees.getLastThree());


}());
