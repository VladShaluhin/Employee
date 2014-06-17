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

;(function(){
  'use strict';

  var AbstractEmployee = function (){

  }

  _.extend(AbstractEmployee.prototype, {
     getSalary: function(){
         throw new Error('Redefine \'getSalary\' method.');
     }
  });

}());
