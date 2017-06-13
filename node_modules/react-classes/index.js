var React = require('react/addons')
var classSet = React.addons.classSet;

module.exports = {

  propTypes: {
    className: React.PropTypes.string
  },

  /**
   * @function getClass
   * @param {object} initial
   * @param {object} additional
   * @returns {object}
   */
  getClass: function (initial, additional) {

    var classString = '';

    //Initialize the classString with the classNames that were passed in
    if (this.props.className) {
      classString += ' ' + this.props.className;
    }

    /**
     * Add in initial classes
     */
    if (typeof initial === 'object') {
      classString += ' ' + classSet(initial);
    } else {
      classString += ' ' + initial;
    }

    /**
     * If there is additional classes, then
     * add them to the classSet as well.
     */
    if (additional) {
      classString += ' ' + classSet(additional);
    }

    // Convert the class string into an object and run it through the class set
    return classSet(this.getClassSet(classString));

  },

  /**
   * @function getClassSet
   * @param {string} classString
   * @returns {object} classes
   */
  getClassSet: function (classString) {
    var classes = {};

    if (classString) {
      classString.split(' ').forEach(function(className) {
        if (className) {
          classes[className] = true;
        }
      });
    }

    return classes;
  }

};
